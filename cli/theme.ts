import { EOL } from "node:os";
import type { TonalPalette } from "@material/material-color-utilities";
import {
  argbFromHex,
  themeFromSourceColor,
} from "@material/material-color-utilities";

// ARGB to HEX 変換関数
export function argbToHex(argb: number): string {
  const red = (argb >> 16) & 0xff;
  const green = (argb >> 8) & 0xff;
  const blue = argb & 0xff;
  return `#${[red, green, blue]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`;
}

// CSSカラーカスタムプロパティを生成する関数
export function generateThemeCssFromColor(sourceColorHex = "#6750A4"): string {
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
