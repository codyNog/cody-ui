import { updateDenoJsonImportsIfNeeded } from "./deno";
import { main as nodeMain } from "./node";

async function mainCli() {
  const isDeno = typeof Deno !== "undefined";

  // 共通のメイン処理を実行し、リポジトリのpackage.jsonを取得
  const repoPackageJson = await nodeMain();

  if (isDeno) {
    // Deno 固有の処理 (deno.json の更新など)
    // Deno実行時はGitHubからのファイル取得がメインではない場合もあるが、
    // nodeMainで取得したrepoPackageJsonがあればそれを利用する
    await updateDenoJsonImportsIfNeeded(true, repoPackageJson);
    // Deno でも nodeMain を実行するが、Deno 固有のセットアップ後に行う
    // dotenv.config() は Deno の場合、deno.json や import_map.json で環境変数を扱うのが一般的
    // ここでは node.js 側で dotenv を呼んでいるので、Deno 側では明示的に呼ばない
  } else {
    // Node.js 固有の処理 (dotenv の読み込みなど)
    // node.ts 内で dotenv.config() が呼ばれる

    // Node.jsで実行後、取得したrepoPackageJsonを使ってdeno.jsonも更新する
    // これにより、Node.jsでコンポーネントをダウンロードした後、Denoでも利用しやすくなる
    if (repoPackageJson) {
      console.log(
        "\n[CLI] Updating deno.json with dependencies from fetched package.json...",
      );
      await updateDenoJsonImportsIfNeeded(true, repoPackageJson);
    }
  }
}

mainCli().catch((error) => {
  console.error("❌ An unexpected error occurred in CLI:", error);
  if (typeof process !== "undefined" && process.exit) {
    process.exit(1);
  }
});
