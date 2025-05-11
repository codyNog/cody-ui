import * as fs from "node:fs/promises";
import * as path from "node:path";
import { DENO_JSON_TARGET_NPM_PACKAGES } from "./constants.js";
import type { DenoJson, PackageJson } from "./types.js";

export async function updateDenoJsonImportsIfNeeded(
  isDeno: boolean,
  repoPackageJson: PackageJson | null,
): Promise<void> {
  if (!isDeno) {
    return;
  }

  try {
    const dependenciesToUpdate: Record<string, string> = {};

    // 1. このプロジェクトの package.json を読み込む (存在すれば)
    const projectRoot =
      typeof Deno !== "undefined" ? Deno.cwd() : process.cwd();
    const thisProjectPackageJsonPath = path.join(projectRoot, "package.json");
    let thisProjectPackageJson: PackageJson | null = null;
    try {
      const packageJsonContent = await fs.readFile(
        thisProjectPackageJsonPath,
        "utf-8",
      );
      thisProjectPackageJson = JSON.parse(packageJsonContent);
    } catch (error) {
      console.warn(
        `[updateDenoJsonImports] Failed to read this project's package.json at ${thisProjectPackageJsonPath}. Proceeding without it.`,
        error,
      );
    }

    // ローカルの package.json の依存関係を処理
    if (thisProjectPackageJson) {
      for (const pkgName of DENO_JSON_TARGET_NPM_PACKAGES) {
        const version =
          thisProjectPackageJson.dependencies?.[pkgName] ||
          thisProjectPackageJson.devDependencies?.[pkgName];
        if (version) {
          dependenciesToUpdate[`npm:${pkgName}`] =
            `npm:${pkgName}@${version.startsWith("^") || version.startsWith("~") ? "" : "^"}${version.replace(/[\^~]/g, "")}`;
        } else {
          // console.warn( // リポジトリ側にあればそちらを使うので、ここでは警告しない
          //   `[updateDenoJsonImports] Version for ${pkgName} not found in this project's package.json.`,
          // );
        }
      }
    }

    // 2. GitHubから取得した package.json の依存関係を処理 (引数で渡されたもの)
    if (repoPackageJson?.dependencies) {
      console.log(
        "[updateDenoJsonImports] Processing dependencies from repository package.json:",
        repoPackageJson.dependencies,
      );
      for (const pkgName of DENO_JSON_TARGET_NPM_PACKAGES) {
        const version = repoPackageJson.dependencies[pkgName];
        if (version) {
          // ローカルの依存関係よりもリポジトリの依存関係を優先する場合、ここで上書き
          // もしくは、ローカルにない場合のみ追加する
          if (
            !dependenciesToUpdate[`npm:${pkgName}`] ||
            dependenciesToUpdate[`npm:${pkgName}`] !==
              `npm:${pkgName}@${version.startsWith("^") || version.startsWith("~") ? "" : "^"}${version.replace(/[\^~]/g, "")}`
          ) {
            dependenciesToUpdate[`npm:${pkgName}`] =
              `npm:${pkgName}@${version.startsWith("^") || version.startsWith("~") ? "" : "^"}${version.replace(/[\^~]/g, "")}`;
            console.log(
              `[updateDenoJsonImports] Adding/Updating ${pkgName} from repository package.json to version ${version}`,
            );
          }
        } else {
          // console.warn( // DENO_JSON_TARGET_NPM_PACKAGES に含まれていても、リポジトリ側になければ何もしない
          //   `[updateDenoJsonImports] Version for ${pkgName} not found in repository's package.json.`,
          // );
        }
      }
    }

    if (Object.keys(dependenciesToUpdate).length === 0) {
      console.log(
        "[updateDenoJsonImports] No target npm packages found with versions in local or repository package.json. Skipping deno.json update.",
      );
      return;
    }

    console.log(
      "[updateDenoJsonImports] Dependencies to update in deno.json:",
      dependenciesToUpdate,
    );

    // 2. 実行場所の deno.json を探索・読み込み
    let denoJsonPath: string | null = null;
    let currentDir = Deno.cwd(); // Denoモードなので Deno.cwd() を直接使
    while (true) {
      const potentialPathJson = path.join(currentDir, "deno.json");
      const potentialPathJsonc = path.join(currentDir, "deno.jsonc");
      try {
        await fs.stat(potentialPathJson); // ファイルの存在確認 (Denoのfsはstatで存在確認)
        denoJsonPath = potentialPathJson;
        break;
      } catch {
        // deno.json が見つからない場合
      }
      try {
        await fs.stat(potentialPathJsonc); // ファイルの存在確認
        denoJsonPath = potentialPathJsonc;
        break;
      } catch {
        // deno.jsonc が見つからない場合
      }

      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        // ルートディレクトリに達した
        break;
      }
      currentDir = parentDir;
    }

    if (!denoJsonPath) {
      console.warn(
        "[updateDenoJsonImports] deno.json or deno.jsonc not found in the current directory or any parent directories. Skipping update.",
      );
      return;
    }

    console.log(
      `[updateDenoJsonImports] Found deno configuration file at: ${denoJsonPath}`,
    );

    let denoJsonContent: DenoJson = {};
    try {
      const rawContent = await fs.readFile(denoJsonPath, "utf-8");
      // 簡単なコメント除去 (JSONC対応のため)
      // 注意: 完璧なJSONCパーサーではないため、複雑なコメントや文字列内のコメントには対応できない可能性あり
      const jsonString = rawContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
      denoJsonContent = JSON.parse(jsonString);
    } catch (error) {
      console.warn(
        `[updateDenoJsonImports] Failed to read or parse ${denoJsonPath}. Creating new if it doesn't exist or has invalid JSON.`,
        error,
      );
      // ファイルが存在しない、またはパースに失敗した場合は新しいオブジェクトで初期化
      denoJsonContent = {};
    }

    // 3. deno.json の imports セクションを更新
    denoJsonContent.imports = {
      ...(denoJsonContent.imports || {}),
      ...dependenciesToUpdate,
    };

    // 4. 更新した deno.json を書き込む
    try {
      const newDenoJsonString = JSON.stringify(denoJsonContent, null, 2);
      await fs.writeFile(denoJsonPath, newDenoJsonString, "utf-8");
      console.log(
        `[updateDenoJsonImports] Successfully updated ${denoJsonPath} with new imports.`,
      );
    } catch (error) {
      console.warn(
        `[updateDenoJsonImports] Failed to write updated content to ${denoJsonPath}.`,
        error,
      );
    }
  } catch (error) {
    console.warn(
      "[updateDenoJsonImports] Error during deno.json update process. Skipping.",
      error,
    );
  }
}
