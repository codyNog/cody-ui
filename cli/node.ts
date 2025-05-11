import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Octokit } from "@octokit/rest";
import AdmZip from "adm-zip";
import * as dotenv from "dotenv";
import { CONFIG } from "./constants.js";
import { generateThemeCssFromColor } from "./theme.js";
import type { PackageJson, VersionInfo } from "./types.js";

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
    targetDir: string,
    destination: string,
  ): Promise<void> => {
    const zip = new AdmZip(Buffer.from(zipData)); // AdmZipはBufferを期待
    const zipEntries = zip.getEntries();

    // リポジトリルートのディレクトリ名を取得 (通常は <owner>-<repo>-<commit_sha> のような形式)
    const repoRootDir = zipEntries[0].entryName.split("/")[0];
    const sourceDirInZip = `${repoRootDir}/${targetDir}/`; // Zip内の正しいソースディレクトリパス

    await fs.mkdir(destination, { recursive: true });

    for (const zipEntry of zipEntries) {
      if (
        zipEntry.entryName.startsWith(sourceDirInZip) &&
        !zipEntry.isDirectory
      ) {
        const relativePath = zipEntry.entryName.substring(
          sourceDirInZip.length,
        );
        const destPath = path.join(destination, relativePath);
        const dirName = path.dirname(destPath);

        await fs.mkdir(dirName, { recursive: true });
        await fs.writeFile(destPath, zipEntry.getData());

        if (destPath.endsWith("package.json")) {
          try {
            repoPackageJson = JSON.parse(zipEntry.getData().toString("utf-8"));
          } catch (e) {
            console.error("Failed to parse repository package.json:", e);
          }
        }
      }
    }
  };

  const extract = async (options: {
    force?: boolean;
    skipDependencies?: boolean;
    color?: string;
  }): Promise<PackageJson | null> => {
    const { force = false, skipDependencies = false, color } = options;
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

      const destinationPath = path.resolve(process.cwd(), CONFIG.path);
      console.log(`⏳ Extracting to ${destinationPath}...`);
      await extractSpecificDirectory(zipData, CONFIG.path, destinationPath);
      console.log("✅ Extraction complete.");

      if (latestTag) {
        await saveVersion(latestTag);
      }

      if (color) {
        const themeCss = generateThemeCssFromColor(color);
        const cssFilePath = path.join(destinationPath, "theme.css"); // src/theme.css
        await fs.writeFile(cssFilePath, `:root {\n${themeCss}\n}\n`);
        console.log(`🎨 Custom theme generated and saved to ${cssFilePath}`);
      }

      if (!skipDependencies && repoPackageJson) {
        const localPackageJsonPath = await findNearestPackageJson(
          process.cwd(),
        );
        if (localPackageJsonPath) {
          await mergeDependencies(localPackageJsonPath, repoPackageJson);
        } else {
          console.warn(
            "⚠️ package.json not found in the current directory or parent directories. Skipping dependency merge.",
          );
        }
      } else if (!skipDependencies) {
        console.log(
          "📦 No package.json found in the repository's src directory or dependencies merge skipped.",
        );
      }
    } catch (error) {
      console.error("❌ An error occurred:", error);
    }
    return repoPackageJson;
  };

  return { extract, getLatestTag, getCurrentVersion };
};

export const main = async (): Promise<PackageJson | null> => {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const skipDependencies = args.includes("--skip-dependencies");
  const colorArg = args.find((arg) => arg.startsWith("--color="));
  const color = colorArg ? colorArg.split("=")[1] : undefined;

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error(
      "❌ GITHUB_TOKEN environment variable is not set. Please set it to proceed.",
    );
    process.exit(1);
  }

  const extractor = GitHubFileExtractor(token, typeof Deno !== "undefined");
  return extractor.extract({ force, skipDependencies, color });
};
