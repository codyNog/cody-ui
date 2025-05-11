export const CONFIG = {
  org: "codyNog",
  repo: "cody-ui",
  path: "", // "src" から空文字に変更 (ルートを参照するため)
  branch: "main",
  remoteSrcPath: "src", // ダウンロード・展開するリモートのソースパス
  versionFile: ".ui-version.json",
} as const;

export const DENO_JSON_TARGET_NPM_PACKAGES = [
  "@material/material-color-utilities",
  "@octokit/rest",
  "adm-zip",
  "dotenv",
];
