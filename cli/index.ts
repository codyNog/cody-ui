import { updateDenoJsonImportsIfNeeded } from "./deno";
import { main as nodeMain } from "./node";
import type { CliOptions, PackageJson } from "./types";

async function mainCli() {
  const isDeno = typeof Deno !== "undefined";
  let repoPackageJson: PackageJson | null = null;

  if (isDeno) {
    // Deno環境で引数をパース
    // @ts-ignore Deno固有のURLインポートのため、tscの型チェックではエラーになるが実行時Deno環境では問題ない
    const { parse } = await import("https://deno.land/std/flags/mod.ts");
    const flags = parse(Deno.args, {
      string: ["output", "color", "o", "c"], // 文字列として扱うオプション
      boolean: ["force", "skip-dependencies", "f", "s"], // 真偽値として扱うオプション
      alias: { o: "output", c: "color", f: "force", s: "skip-dependencies" }, // エイリアス
    });

    const cliOptions: CliOptions = {
      force: flags.force,
      skipDependencies: flags["skip-dependencies"],
      color: flags.color,
      outputPath: flags.output,
    };
    repoPackageJson = await nodeMain(cliOptions);
    await updateDenoJsonImportsIfNeeded(
      true,
      repoPackageJson,
      cliOptions.outputPath,
    );
  } else {
    // Node.js環境 (nodeMain内でcommanderが引数を処理)
    repoPackageJson = await nodeMain();
    if (repoPackageJson) {
      console.log(
        "\n[CLI] Updating deno.json with dependencies from fetched package.json...",
      );
      await updateDenoJsonImportsIfNeeded(true, repoPackageJson); // Node.js実行後でもdeno.jsonを更新
    }
  }
}

mainCli().catch((error) => {
  console.error("❌ An unexpected error occurred in CLI:", error);
  if (typeof process !== "undefined" && process.exit) {
    process.exit(1);
  }
});
