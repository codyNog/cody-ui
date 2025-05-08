#!/usr/bin/env node
import * as fs from "node:fs/promises";
import { EOL } from "node:os";
import * as path from "node:path";
import {
  argbFromHex,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import type { TonalPalette } from "@material/material-color-utilities"; // TonalPalette を型としてインポート
import { Octokit } from "@octokit/rest";
// @ts-ignore
import AdmZip from "adm-zip";
import * as dotenv from "dotenv";

dotenv.config();

const CONFIG = {
  org: "codyNog",
  repo: "cody-ui",
  path: "src",
  branch: "main",
  versionFile: ".ui-version.json",
} as const;

interface VersionInfo {
  lastTag: string;
  lastUpdate: string;
  repository: string;
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  // biome-ignore lint:
  [key: string]: any;
}

// --- ここから移植 ---
// ARGB to HEX 変換関数
function argbToHex(argb: number): string {
  const red = (argb >> 16) & 0xff;
  const green = (argb >> 8) & 0xff;
  const blue = argb & 0xff;
  return `#${[red, green, blue]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`;
}

// CSSカラーカスタムプロパティを生成する関数
function generateThemeCssFromColor(sourceColorHex = "#131313"): string {
  const sourceColorArgb = argbFromHex(sourceColorHex);
  const theme = themeFromSourceColor(sourceColorArgb);

  const colorProperties: string[] = [];
  const lightScheme = theme.schemes.light;
  const darkScheme = theme.schemes.dark; // ダークスキームを取得
  const palettes = theme.palettes;

  // 1. 基本的な色は lightScheme と darkScheme から取得
  const M3SystemColorKeys = [
    // 変数名を変更 (Lightを削除)
    "primary",
    "onPrimary",
    "primaryContainer",
    "onPrimaryContainer",
    "secondary",
    "onSecondary",
    "secondaryContainer",
    "onSecondaryContainer",
    "tertiary",
    "onTertiary",
    "tertiaryContainer",
    "onTertiaryContainer",
    "error",
    "onError",
    "errorContainer",
    "onErrorContainer",
    "background",
    "onBackground",
    "surface",
    "onSurface",
    "surfaceVariant",
    "onSurfaceVariant",
    "outline",
    "outlineVariant",
    "shadow",
    "scrim",
    "inverseSurface",
    "inverseOnSurface",
    "inversePrimary",
    // "surfaceTint" は additionalPaletteColors で定義
  ];

  for (const key of M3SystemColorKeys) {
    // biome-ignore lint/suspicious/noExplicitAny: Schemeのプロパティアクセスにanyを使用
    const lightArgbValue = (lightScheme as any)[key];
    // biome-ignore lint/suspicious/noExplicitAny: Schemeのプロパティアクセスにanyを使用
    const darkArgbValue = (darkScheme as any)[key];

    if (
      typeof lightArgbValue === "number" &&
      typeof darkArgbValue === "number"
    ) {
      const kebabKey = key.replace(
        /([A-Z])/g,
        (match) => `-${match.toLowerCase()}`,
      );
      const cssVarName = `--md-sys-color-${kebabKey}`;
      const lightHex = argbToHex(lightArgbValue);
      const darkHex = argbToHex(darkArgbValue);
      colorProperties.push(
        `  ${cssVarName}: light-dark(${lightHex}, ${darkHex});`,
      );
    }
  }

  // 2. 追加の詳細なカラーロールをパレットとトーンから生成 (ライトテーマとダークテーマでトーンが異なる場合があるため、それぞれ定義)
  // ダークテーマ用のトーンはM3の仕様に基づいて調整が必要な場合があります。
  // ここでは例としてライトテーマと同じトーンを使用したり、一般的なダークテーマの調整を加えています。
  const additionalPaletteColorsLight: Record<
    string,
    { palette: TonalPalette; tone: number }
  > = {
    "primary-fixed": { palette: palettes.primary, tone: 90 },
    "primary-fixed-dim": { palette: palettes.primary, tone: 80 },
    "on-primary-fixed": { palette: palettes.primary, tone: 10 },
    "on-primary-fixed-variant": { palette: palettes.primary, tone: 30 },
    "secondary-fixed": { palette: palettes.secondary, tone: 90 },
    "secondary-fixed-dim": { palette: palettes.secondary, tone: 80 },
    "on-secondary-fixed": { palette: palettes.secondary, tone: 10 },
    "on-secondary-fixed-variant": { palette: palettes.secondary, tone: 30 },
    "tertiary-fixed": { palette: palettes.tertiary, tone: 90 },
    "tertiary-fixed-dim": { palette: palettes.tertiary, tone: 80 },
    "on-tertiary-fixed": { palette: palettes.tertiary, tone: 10 },
    "on-tertiary-fixed-variant": { palette: palettes.tertiary, tone: 30 },
    "surface-dim": { palette: palettes.neutral, tone: 87 },
    "surface-bright": { palette: palettes.neutral, tone: 98 },
    "surface-container-lowest": { palette: palettes.neutral, tone: 100 },
    "surface-container-low": { palette: palettes.neutral, tone: 96 },
    "surface-container": { palette: palettes.neutral, tone: 94 },
    "surface-container-high": { palette: palettes.neutral, tone: 92 },
    "surface-container-highest": { palette: palettes.neutral, tone: 90 },
    "surface-tint": { palette: palettes.primary, tone: 40 }, // lightScheme.primary と同じ
  };

  const additionalPaletteColorsDark: Record<
    string,
    { palette: TonalPalette; tone: number }
  > = {
    // ダークテーマではトーンを調整 (例)
    "primary-fixed": { palette: palettes.primary, tone: 90 }, // M3では P90
    "primary-fixed-dim": { palette: palettes.primary, tone: 80 }, // M3では P80
    "on-primary-fixed": { palette: palettes.primary, tone: 10 }, // M3では P10
    "on-primary-fixed-variant": { palette: palettes.primary, tone: 30 }, // M3では P30
    "secondary-fixed": { palette: palettes.secondary, tone: 90 }, // M3では S90
    "secondary-fixed-dim": { palette: palettes.secondary, tone: 80 }, // M3では S80
    "on-secondary-fixed": { palette: palettes.secondary, tone: 10 }, // M3では S10
    "on-secondary-fixed-variant": { palette: palettes.secondary, tone: 30 }, // M3では S30
    "tertiary-fixed": { palette: palettes.tertiary, tone: 90 }, // M3では T90
    "tertiary-fixed-dim": { palette: palettes.tertiary, tone: 80 }, // M3では T80
    "on-tertiary-fixed": { palette: palettes.tertiary, tone: 10 }, // M3では T10
    "on-tertiary-fixed-variant": { palette: palettes.tertiary, tone: 30 }, // M3では T30
    "surface-dim": { palette: palettes.neutral, tone: 6 }, // M3では N6
    "surface-bright": { palette: palettes.neutral, tone: 24 }, // M3では N24
    "surface-container-lowest": { palette: palettes.neutral, tone: 4 }, // M3では N4
    "surface-container-low": { palette: palettes.neutral, tone: 10 }, // M3では N10
    "surface-container": { palette: palettes.neutral, tone: 12 }, // M3では N12
    "surface-container-high": { palette: palettes.neutral, tone: 17 }, // M3では N17
    "surface-container-highest": { palette: palettes.neutral, tone: 22 }, // M3では N22
    "surface-tint": { palette: palettes.primary, tone: 80 }, // darkScheme.primary と同じ (M3では P80)
  };

  // Object.keys を使ってキーのセットを取得し、両方のテーマで処理
  const allAdditionalKeys = new Set([
    ...Object.keys(additionalPaletteColorsLight),
    ...Object.keys(additionalPaletteColorsDark),
  ]);

  for (const kebabKey of allAdditionalKeys) {
    const lightConfig = additionalPaletteColorsLight[kebabKey];
    const darkConfig = additionalPaletteColorsDark[kebabKey];

    if (!lightConfig?.palette || !darkConfig?.palette) {
      continue;
    }

    try {
      const lightArgbValue = lightConfig.palette.tone(lightConfig.tone);
      const darkArgbValue = darkConfig.palette.tone(darkConfig.tone);

      if (
        typeof lightArgbValue === "number" &&
        typeof darkArgbValue === "number"
      ) {
        const cssVarName = `--md-sys-color-${kebabKey}`;
        // M3SystemColorKeys から既に同じキーが生成されていなければ追加
        if (
          !colorProperties.some((p) => p.trim().startsWith(`${cssVarName}:`))
        ) {
          const lightHex = argbToHex(lightArgbValue);
          const darkHex = argbToHex(darkArgbValue);
          colorProperties.push(
            `  ${cssVarName}: light-dark(${lightHex}, ${darkHex});`,
          );
        }
      }
    } catch (_error) {
      // エラーはキャッチするが、ログ出力はしない
    }
  }

  if (colorProperties.length === 0) {
    // エラーログは残すか検討 (今回は削除の指示なので削除)
  }
  colorProperties.sort();
  return colorProperties.join(EOL);
}
// --- ここまで移植 ---

const GitHubFileExtractor = (token: string) => {
  const octokit = new Octokit({
    auth: token,
    baseUrl: "https://api.github.com",
  });

  let repoPackageJson: PackageJson | null = null;

  const findNearestPackageJson = async (
    startDir: string,
  ): Promise<string | null> => {
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
    repoPackageJson: PackageJson,
  ): Promise<void> => {
    if (!repoPackageJson?.dependencies) {
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
      const repoDependencies = { ...repoPackageJson.dependencies };

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
  };

  const downloadZip = async (): Promise<Buffer> => {
    console.log(`📦 Downloading ${CONFIG.org}/${CONFIG.repo}...`);

    const response = await fetch(
      `https://api.github.com/repos/${CONFIG.org}/${CONFIG.repo}/zipball/${CONFIG.branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "commune-ui-extractor",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to download ZIP: ${response.status} ${response.statusText}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  };

  const extractSpecificDirectory = async (
    zipBuffer: Buffer,
    outputPath: string,
  ): Promise<void> => {
    console.log(`📂 Extracting files to ${outputPath}...`);

    try {
      const zip = new AdmZip(zipBuffer);
      const entries = zip.getEntries();

      if (entries.length === 0) {
        throw new Error("ZIP file is empty");
      }

      const rootDir = entries[0].entryName.split("/")[0];
      const targetPathInZip = `${rootDir}/${CONFIG.path}/`;
      const _extractPath = path.join(outputPath, rootDir);
      const packageJsonEntry = entries.find(
        (entry: { entryName: string }) =>
          entry.entryName === `${rootDir}/package.json`,
      );

      if (packageJsonEntry) {
        const content = packageJsonEntry.getData().toString("utf-8");
        repoPackageJson = JSON.parse(content);
      }

      const filteredEntries = entries.filter((entry: { entryName: string }) =>
        entry.entryName.startsWith(targetPathInZip),
      );
      if (filteredEntries.length === 0) {
        throw new Error(
          `No files found in ${CONFIG.path} directory within the zip file`,
        );
      }

      const tempZip = new AdmZip();
      for (const entry of filteredEntries) {
        tempZip.addFile(
          entry.entryName.substring(targetPathInZip.length),
          entry.getData(),
        );
      }

      tempZip.extractAllTo(outputPath, true);

      console.log(`✅ All files extracted to: ${outputPath}`);
    } catch (error) {
      console.error("Error during extraction:", error);
      throw error;
    }
  };

  const extract = async (options: {
    force?: boolean;
    outputPath: string;
  }): Promise<void> => {
    try {
      await octokit.repos.get({
        owner: CONFIG.org,
        repo: CONFIG.repo,
      });

      const latestTag = await getLatestTag();
      if (!latestTag) {
        throw new Error("No tags found in repository");
      }

      const currentVersion = await getCurrentVersion();

      console.log("Current version:", currentVersion?.lastTag || "None");
      console.log("Latest tag:", latestTag);

      if (!options.force && currentVersion?.lastTag === latestTag) {
        console.log("✨ Already up to date!");
        return;
      }

      console.log(
        `🚀 Starting extraction of files from ${CONFIG.org}/${CONFIG.repo}:${CONFIG.path} to ${options.outputPath}`,
      );

      const zipBuffer = await downloadZip();

      console.log(
        `Downloaded ZIP file size: ${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB`,
      );

      await extractSpecificDirectory(zipBuffer, options.outputPath);

      // --- テーマカラー生成処理 ---
      console.log("🎨 Generating theme colors for src/theme.css...");
      try {
        const keyColor = process.env.THEME_KEY_COLOR || "#131313";
        const newThemeColorProperties = generateThemeCssFromColor(keyColor);
        const themeCssPath = path.join(options.outputPath, "theme.css"); // 書き込み先を outputPath の中の theme.css に変更
        const replacementComment = "/* m3 theme generated from source color */";
        // newThemeColorProperties は generateThemeCssFromColor から返される ; 付きの文字列の集まり
        const newCssVariables = newThemeColorProperties; // 変数名を分かりやすく

        // 新しいファイル内容を :root で囲んで作成
        const newFileContent = `:root {${EOL}${replacementComment}${EOL}${newCssVariables}${EOL}}`;

        await fs.writeFile(themeCssPath, newFileContent, "utf8");
        console.log(
          `✅ Theme colors updated successfully in ${themeCssPath} with key color ${keyColor}.`,
        );
      } catch (error) {
        console.error("❌ Failed to generate or update theme colors:", error);
      }
      // --- テーマカラー生成処理ここまで ---

      await saveVersion(latestTag);

      // Check for package.json in the output directory
      const outputPackageJsonPath = path.join(
        options.outputPath,
        "package.json",
      );
      try {
        await fs.access(outputPackageJsonPath);
        console.log(`Found package.json at: ${outputPackageJsonPath}`);
        if (!repoPackageJson) {
          console.warn(
            "Repository package.json not found in zip.  Skipping dependency merge.",
          );
        } else {
          await mergeDependencies(outputPackageJsonPath, repoPackageJson);
        }
      } catch {
        // If package.json doesn't exist in the output path, search parent directories.
        const nearestPackageJson = await findNearestPackageJson(process.cwd());
        if (nearestPackageJson) {
          console.log(`Found package.json at: ${nearestPackageJson}`);
          if (!repoPackageJson) {
            console.warn(
              "Repository package.json not found in zip.  Skipping dependency merge.",
            );
          } else {
            await mergeDependencies(nearestPackageJson, repoPackageJson);
          }
        } else {
          console.log("No package.json found in parent directories");
        }
      }

      console.log("✨ Files copied successfully!");
      // biome-ignore lint:
    } catch (error: any) {
      console.error("❌ Extraction failed:", error.message);
      if (error.response?.status === 404) {
        console.error("Repository or branch not found. Please check:");
        console.error(`1. Organization: ${CONFIG.org}`);
        console.error(`2. Repository: ${CONFIG.repo}`);
        console.error(`3. Branch: ${CONFIG.branch}`);
        console.error("4. Token permissions");
      }
      process.exit(1);
    }
  };

  return {
    extract,
  };
};

const main = async () => {
  const token = process.env.GITHUB_TOKEN;
  const force = process.argv.includes("--force");

  const outputArgIndex = process.argv.findIndex((arg) => arg === "--output");
  const outputPath =
    outputArgIndex !== -1 ? process.argv[outputArgIndex + 1] : ".";

  if (!token) {
    console.error("❌ GITHUB_TOKEN environment variable is required");
    process.exit(1);
  }

  try {
    const extractor = GitHubFileExtractor(token);
    await extractor.extract({ force, outputPath });
  } catch (error) {
    console.error("Failed to run the extractor:", error);
    process.exit(1);
  }
};

main().catch(console.error);
