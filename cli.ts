#!/usr/bin/env node
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Octokit } from "@octokit/rest";
// @ts-ignore
import AdmZip from "adm-zip";
import * as dotenv from "dotenv";
import { EOL } from "node:os";
import {
  argbFromHex,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import type { TonalPalette } from "@material/material-color-utilities"; // TonalPalette を型としてインポート

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
  const palettes = theme.palettes;

  console.log(
    "🎨 Generating CSS color properties from lightScheme and palettes...",
  );

  // 1. 基本的な色は lightScheme から直接取得
  const M3SystemLightColorKeys = [
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
    "shadow", // shadow と scrim は色だが、他のデザイントークンと一緒に global.css に残すことも検討可
    "scrim",
    "inverseSurface",
    "inverseOnSurface",
    "inversePrimary",
    // "surfaceTint" は additionalPaletteColors で定義
  ];

  for (const key of M3SystemLightColorKeys) {
    // biome-ignore lint/suspicious/noExplicitAny: Schemeのプロパティアクセスにanyを使用
    const argbValue = (lightScheme as any)[key];
    if (typeof argbValue === "number") {
      const kebabKey = key.replace(
        /([A-Z])/g,
        (match) => `-${match.toLowerCase()}`,
      );
      const cssVarName = `--md-sys-color-${kebabKey}`;
      colorProperties.push(`  ${cssVarName}: ${argbToHex(argbValue)}`);
    } else {
      console.warn(
        `⚠️ Could not get ARGB value for scheme color "${key}": ${argbValue}`,
      );
    }
  }

  // 2. 追加の詳細なカラーロールをパレットとトーンから生成
  const additionalPaletteColors: Record<
    string,
    { palette: TonalPalette; tone: number }
  > = {
    // --- Fixed ---
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
    // --- Surface Containers ---
    "surface-dim": { palette: palettes.neutral, tone: 87 },
    "surface-bright": { palette: palettes.neutral, tone: 98 },
    "surface-container-lowest": { palette: palettes.neutral, tone: 100 },
    "surface-container-low": { palette: palettes.neutral, tone: 96 },
    "surface-container": { palette: palettes.neutral, tone: 94 },
    "surface-container-high": { palette: palettes.neutral, tone: 92 },
    "surface-container-highest": { palette: palettes.neutral, tone: 90 },
    // --- Surface Tint ---
    "surface-tint": { palette: palettes.primary, tone: 40 },
  };

  console.log("🎨 Generating additional color properties from palettes...");
  for (const [kebabKey, { palette, tone }] of Object.entries(
    additionalPaletteColors,
  )) {
    if (!palette) {
      console.warn(
        `❓ Palette not found for generating ${kebabKey}. Skipping.`,
      );
      continue;
    }
    try {
      const argbValue = palette.tone(tone);
      if (typeof argbValue === "number") {
        const cssVarName = `--md-sys-color-${kebabKey}`;
        // lightScheme から既に同じキーが生成されていなければ追加
        if (
          !colorProperties.some((p) => p.trim().startsWith(`${cssVarName}:`))
        ) {
          console.log(`  ➕ Adding ${cssVarName} from palette.`);
          colorProperties.push(`  ${cssVarName}: ${argbToHex(argbValue)}`);
        }
      } else {
        console.warn(
          `⚠️ Could not get number value for ${kebabKey} (Tone ${tone}) from palette.`,
        );
      }
    } catch (error) {
      console.error(`❌ Error generating ${kebabKey} from palette:`, error);
    }
  }

  if (colorProperties.length === 0) {
    console.error(
      "🚨 No color properties generated! Check color generation logic.",
    );
  } else {
    console.log(
      `✨ Generated ${colorProperties.length} CSS color properties in total.`,
    );
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

      // --- テーマカラー生成処理 ---
      console.log("🎨 Generating theme colors for src/theme.css...");
      try {
        const keyColor = process.env.THEME_KEY_COLOR || "#131313";
        const newThemeColorProperties = generateThemeCssFromColor(keyColor);
        const themeCssPath = "src/theme.css"; // 書き込み先を theme.css に変更
        let themeCssContent = "";
        try {
          themeCssContent = await fs.readFile(themeCssPath, "utf8");
        } catch (e: unknown) {
          const readError = e as Error & { code?: string }; // 型アサーション
          if (readError.code !== "ENOENT") {
            // ファイルが存在しないエラー以外は再スロー
            throw readError;
          }
          // ファイルが存在しない場合は空の内容で開始
          console.log(`ℹ️ ${themeCssPath} not found, will create it.`);
        }

        const themeBlockRegex =
          /(\/\*\s*m3 theme generated from source color\s*\*\/)([\s\S]*?)(?=\s*--md-sys-color-background:|$)/s; // マッチ範囲を調整
        const fallbackRegex =
          /(\/\*\s*m3 theme\s*\*\/)([\s\S]*?)(?=\s*--md-sys-color-background:|$)/s; // マッチ範囲を調整

        const replacementComment = "/* m3 theme generated from source color */";
        const newThemeBlockContent = `${replacementComment}${EOL}${newThemeColorProperties}${EOL}`;

        let updatedContent: string = themeCssContent; // 初期値を設定し、型を明示
        if (themeBlockRegex.test(themeCssContent)) {
          updatedContent = themeCssContent.replace(
            themeBlockRegex,
            newThemeBlockContent,
          );
        } else if (fallbackRegex.test(themeCssContent)) {
          updatedContent = themeCssContent.replace(
            fallbackRegex,
            newThemeBlockContent,
          );
        } else {
          // :root があるか確認し、なければ作成
          if (themeCssContent.includes(":root {")) {
            updatedContent = themeCssContent.replace(
              /(:root\s*\{)/,
              `$1${EOL}${newThemeBlockContent}`,
            );
          } else {
            updatedContent = `:root {${EOL}${newThemeBlockContent}}${EOL}${themeCssContent}`;
            console.warn(
              `⚠️ :root block not found in ${themeCssPath}. Created a new :root block.`,
            );
          }
          console.warn(
            `⚠️ Could not find m3 theme markers in ${themeCssPath}. Inserted into :root.`,
          );
        }
        await fs.writeFile(themeCssPath, updatedContent, "utf8");
        console.log(
          `✅ Theme colors updated successfully in ${themeCssPath} with key color ${keyColor}.`,
        );
      } catch (error) {
        console.error("❌ Failed to generate or update theme colors:", error);
      }
      // --- テーマカラー生成処理ここまで ---

      console.log(
        `🚀 Starting extraction of files from ${CONFIG.org}/${CONFIG.repo}:${CONFIG.path} to ${options.outputPath}`,
      );

      const zipBuffer = await downloadZip();

      console.log(
        `Downloaded ZIP file size: ${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB`,
      );

      await extractSpecificDirectory(zipBuffer, options.outputPath);
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
