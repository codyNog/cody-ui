import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Octokit } from "@octokit/rest";
import AdmZip from "adm-zip";
import { Command } from "commander";
import * as dotenv from "dotenv";
import { CONFIG } from "./constants.js";
import { generateThemeCssFromColor } from "./theme.js";
import type { CliOptions, PackageJson, VersionInfo } from "./types.js";

if (typeof Deno === "undefined") {
  // Deno実行時以外でdotenvを有効にする
  dotenv.config();
}

export const GitHubFileExtractor = (token: string, isDeno: boolean) => {
  const octokit = new Octokit({
    auth: token,
    baseUrl: "https://api.github.com",
  });

  let repoPackageJson: PackageJson | null = null;

  const findNearestPackageJson = async (
    startDir: string,
  ): Promise<string | null> => {
    if (isDeno) return null; // Denoの場合は何もしない
    let currentDir = startDir;

    while (currentDir !== path.parse(currentDir).root) {
      const packageJsonPath = path.join(currentDir, "package.json");
      try {
        await fs.access(packageJsonPath);
        return packageJsonPath;
      } catch {
        currentDir = path.dirname(currentDir);
      }
    }

    return null;
  };

  const mergeDependencies = async (
    localPackageJsonPath: string,
    repoPackageJsonData: PackageJson, // 引数名を変更して明確化
  ): Promise<void> => {
    if (isDeno) return; // Denoの場合は何もしない
    if (!repoPackageJsonData?.dependencies) {
      console.log("No dependencies found in repository package.json");
      return;
    }

    try {
      const localPackageJsonContent = await fs.readFile(
        localPackageJsonPath,
        "utf-8",
      );
      const localPackageJson: PackageJson = JSON.parse(localPackageJsonContent);

      const oldDependencies = { ...localPackageJson.dependencies };

      // 明示的にdependenciesのみを取り出し、devDependenciesは含まないようにする
      const repoDependencies = { ...repoPackageJsonData.dependencies };

      localPackageJson.dependencies = {
        ...(localPackageJson.dependencies || {}),
        ...repoDependencies,
      };

      const added: string[] = [];
      const updated: string[] = [];
      for (const [pkg, version] of Object.entries(repoDependencies)) {
        if (!oldDependencies?.[pkg]) {
          added.push(`${pkg}@${version}`);
        } else if (oldDependencies[pkg] !== version) {
          updated.push(`${pkg}: ${oldDependencies[pkg]} -> ${version}`);
        }
      }

      if (added.length > 0 || updated.length > 0) {
        await fs.writeFile(
          localPackageJsonPath,
          `${JSON.stringify(localPackageJson, null, 2)}\n`,
          "utf-8",
        );

        console.log("\n📦 Dependencies updated in package.json:");
        if (added.length > 0) {
          console.log("\nAdded:");
          for (const pkg of added) {
            console.log(`+ ${pkg}`);
          }
        }
        if (updated.length > 0) {
          console.log("\nUpdated:");
          for (const pkg of updated) {
            console.log(`• ${pkg}`);
          }
        }
      } else {
        console.log("\n📦 Dependencies are already up to date");
      }
    } catch (error) {
      console.error("Error merging dependencies:", error);
      throw error;
    }
  };

  const getLatestTag = async (): Promise<string | null> => {
    try {
      const { data } = await octokit.repos.listTags({
        owner: CONFIG.org,
        repo: CONFIG.repo,
        per_page: 1,
      });

      return data[0]?.name || null;
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      return null;
    }
  };

  const getCurrentVersion = async (): Promise<VersionInfo | null> => {
    try {
      const content = await fs.readFile(CONFIG.versionFile, "utf-8");
      return JSON.parse(content);
    } catch {
      return null;
    }
  };

  const saveVersion = async (tag: string): Promise<void> => {
    const versionInfo: VersionInfo = {
      lastTag: tag,
      lastUpdate: new Date().toISOString(),
      repository: `${CONFIG.org}/${CONFIG.repo}`,
    };

    await fs.writeFile(
      CONFIG.versionFile,
      JSON.stringify(versionInfo, null, 2),
      "utf-8",
    );
    console.log(`Version ${tag} saved to ${CONFIG.versionFile}`);
  };

  const downloadZip = async (): Promise<Uint8Array> => {
    const { data } = await octokit.repos.downloadZipballArchive({
      owner: CONFIG.org,
      repo: CONFIG.repo,
      ref: CONFIG.branch,
    });
    // @ts-ignore data is ArrayBuffer
    return new Uint8Array(data);
  };

  const extractSpecificDirectory = async (
    zipData: Uint8Array,
    targetDir: string, // ダウンロード・展開するリモートのディレクトリパス (例: "src")
    packageJsonBaseDir: string, // リモートの package.json がある基準ディレクトリパス (例: "")
    destination: string,
  ): Promise<void> => {
    const zip = new AdmZip(Buffer.from(zipData)); // AdmZipはBufferを期待
    const zipEntries = zip.getEntries();

    const repoRootDir = zipEntries[0].entryName.split("/")[0];
    const sourceDirPrefix = targetDir
      ? `${repoRootDir}/${targetDir}/`
      : `${repoRootDir}/`;

    const expectedRepoPackageJsonPath = packageJsonBaseDir
      ? `${repoRootDir}/${packageJsonBaseDir}/package.json`
      : `${repoRootDir}/package.json`;
    let foundRepoPackageJsonInZip = false;

    // まずZIP全体をスキャンしてリポジトリのpackage.jsonを探す
    for (const zipEntry of zipEntries) {
      if (zipEntry.entryName === expectedRepoPackageJsonPath) {
        try {
          repoPackageJson = JSON.parse(zipEntry.getData().toString("utf-8"));
          foundRepoPackageJsonInZip = true;
          console.log(
            `[extractSpecificDirectory] Found and parsed repository package.json from ZIP at: ${zipEntry.entryName}`,
          );
        } catch (e) {
          console.error(
            `[extractSpecificDirectory] Failed to parse repository package.json from ZIP at ${zipEntry.entryName}:`,
            e,
          );
        }
        break; // 見つかったらループを抜ける
      }
    }

    if (
      !foundRepoPackageJsonInZip &&
      expectedRepoPackageJsonPath.endsWith("package.json")
    ) {
      console.warn(
        `[extractSpecificDirectory] Expected repository package.json not found in ZIP at: ${expectedRepoPackageJsonPath}`,
      );
    }

    // 次にtargetDirの中身を展開する
    await fs.mkdir(destination, { recursive: true });
    for (const zipEntry of zipEntries) {
      if (
        zipEntry.entryName.startsWith(sourceDirPrefix) &&
        !zipEntry.isDirectory
      ) {
        const relativePath = zipEntry.entryName.substring(
          sourceDirPrefix.length,
        );
        if (!relativePath && targetDir) {
          // targetDirが指定されていて、かつentryNameがsourceDirPrefixそのものの場合 (例: targetDir="src", entryName="repo-root/src/")
          // これはディレクトリなのでスキップ
          continue;
        }

        const destPath = path.join(destination, relativePath);
        const dirName = path.dirname(destPath);

        await fs.mkdir(dirName, { recursive: true });
        await fs.writeFile(destPath, zipEntry.getData());
      }
    }
  };

  const extract = async (options: CliOptions): Promise<PackageJson | null> => {
    const {
      force = false,
      skipDependencies = false,
      color,
      outputPath,
    } = options;
    console.log(
      `🚀 Starting extraction for ${CONFIG.org}/${CONFIG.repo} (branch: ${CONFIG.branch})`,
    );

    const currentVersion = await getCurrentVersion();
    const latestTag = await getLatestTag();

    if (
      !force &&
      latestTag &&
      currentVersion &&
      currentVersion.lastTag === latestTag
    ) {
      console.log(
        `✅ Already up to date with the latest tag: ${latestTag}. Last checked: ${currentVersion.lastUpdate}`,
      );
      console.log("Use --force to re-download.");
      return null;
    }

    if (latestTag) {
      console.log(
        `ℹ️ Current version: ${currentVersion?.lastTag || "None"}, Latest tag: ${latestTag}`,
      );
    } else {
      console.log(
        "ℹ️ No tags found, proceeding with download from main branch.",
      );
    }

    try {
      console.log(`⏳ Downloading ${CONFIG.path} from ${CONFIG.branch}...`);
      const zipData = await downloadZip();
      console.log("✅ Download complete.");

      const actualOutputPath = outputPath || CONFIG.path;
      const destinationPath = path.resolve(process.cwd(), actualOutputPath);
      console.log(`⏳ Extracting to ${destinationPath}...`);
      // extractSpecificDirectory に remoteSrcPath と path を渡すように変更
      await extractSpecificDirectory(
        zipData,
        CONFIG.remoteSrcPath,
        CONFIG.path,
        destinationPath,
      );
      console.log("✅ Target directory extraction complete.");
      // repoPackageJson は extractSpecificDirectory 内で設定されることを期待

      if (!skipDependencies && repoPackageJson) {
        const localPackageJsonPath =
          await findNearestPackageJson(destinationPath);
        if (localPackageJsonPath) {
          await mergeDependencies(localPackageJsonPath, repoPackageJson);
        } else {
          console.warn(
            "⚠️ Local package.json not found. Skipping dependency merge.",
          );
        }
      } else if (!skipDependencies && !repoPackageJson) {
        console.warn(
          "📦 Repository package.json not found in ZIP or parsed incorrectly. Skipping dependency merge.",
        );
      } else if (skipDependencies) {
        console.log("📦 Dependency merge skipped by option.");
      }

      if (latestTag) {
        await saveVersion(latestTag);
      }

      if (color) {
        const themeCss = generateThemeCssFromColor(color);
        // 出力先ディレクトリ直下に theme.css を作成 (展開された src の中ではない)
        // outputPath が指定されていればそれを使い、なければ展開先 (destinationPath) の一つ上のディレクトリを意図するか、
        // もしくはカレントディレクトリか。ここでは、outputPath があればそれを優先し、
        // なければ destinationPath を基準にするが、src が付与されている可能性を考慮。
        // もし outputPath が 'src/components' のような場合、theme.css は 'src/components/theme.css' になる。
        // これが意図通りか確認が必要だが、一旦 destinationPath 直下とする。
        const cssFilePath = path.join(destinationPath, "theme.css");
        await fs.writeFile(cssFilePath, `:root {\n${themeCss}\n}\n`);
        console.log(`🎨 Custom theme generated and saved to ${cssFilePath}`);
      }
    } catch (error) {
      console.error(
        "❌ An error occurred during the extraction process:",
        error,
      );
    }
    return repoPackageJson; // extractSpecificDirectory で設定されたものが返る
  };

  return { extract, getLatestTag, getCurrentVersion };
};

export const main = async (
  optionsFromCli?: Partial<CliOptions>,
): Promise<PackageJson | null> => {
  let cliOptions: CliOptions = { ...optionsFromCli };

  // optionsFromCliが渡されておらず、かつNode.js環境の場合のみcommanderを使用
  if (!optionsFromCli && typeof Deno === "undefined") {
    const program = new Command();
    program
      .option("-f, --force", "Force re-download even if up to date")
      .option("-s, --skip-dependencies", "Skip merging dependencies")
      .option("-c, --color <hex>", "Specify custom theme color (e.g., #RRGGBB)")
      .option(
        "-o, --output <path>",
        "Output directory for extracted files",
        CONFIG.path,
      ); // デフォルト値をCONFIG.pathに

    program.parse(process.argv);
    const commanderOptions = program.opts();

    cliOptions = {
      force: commanderOptions.force,
      skipDependencies: commanderOptions.skipDependencies,
      color: commanderOptions.color,
      outputPath: commanderOptions.output,
    };
  } else if (optionsFromCli) {
    // Deno環境など、外部からオプションが渡された場合はそれを使用
    cliOptions = {
      force: optionsFromCli.force,
      skipDependencies: optionsFromCli.skipDependencies,
      color: optionsFromCli.color,
      outputPath: optionsFromCli.outputPath || CONFIG.path, // outputがない場合はデフォルト値
    };
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error(
      "❌ GITHUB_TOKEN environment variable is not set. Please set it to proceed.",
    );
    process.exit(1);
  }

  const extractor = GitHubFileExtractor(token, typeof Deno !== "undefined");
  return extractor.extract(cliOptions);
};
