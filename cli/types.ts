export interface CliOptions {
  force?: boolean;
  skipDependencies?: boolean;
  color?: string;
  outputPath?: string;
}

export interface VersionInfo {
  lastTag: string;
  lastUpdate: string;
  repository: string;
}

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  // biome-ignore lint/suspicious/noExplicitAny: 任意で他のプロパティも許可するため
  [key: string]: any;
}

export interface DenoJson {
  imports?: Record<string, string>;
  tasks?: Record<string, string>;
  // biome-ignore lint/suspicious/noExplicitAny: 任意で他のプロパティも許可するため
  [key: string]: any; // 他のプロパティも許可
}
