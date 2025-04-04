#!/usr/bin/env node
import * as fs from "node:fs/promises";
import * as path from "node:path";
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
