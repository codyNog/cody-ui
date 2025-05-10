"use client";
import { forwardRef } from "react";
import type { ReactNode } from "react";
import { Text, type TextProps } from "react-aria-components";
import styles from "./index.module.css";

type Variant =
  | "displayLarge"
  | "displayMedium"
  | "displaySmall"
  | "headlineLarge"
  | "headlineMedium"
  | "headlineSmall"
  | "titleLarge"
  | "titleMedium"
  | "titleSmall"
  | "bodyLarge"
  | "bodyMedium"
  | "bodySmall"
  | "labelLarge"
  | "labelMedium"
  | "labelSmall";

type ColorKey =
  | "background"
  | "errorContainer"
  | "error"
  | "inverseOnSurface"
  | "inversePrimary"
  | "inverseSurface"
  | "onBackground"
  | "onErrorContainer"
  | "onError"
  | "onPrimaryContainer"
  | "onPrimaryFixedVariant"
  | "onPrimaryFixed"
  | "onPrimary"
  | "onSecondaryContainer"
  | "onSecondaryFixedVariant"
  | "onSecondaryFixed"
  | "onSecondary"
  | "onSurfaceVariant"
  | "onSurface"
  | "onTertiaryContainer"
  | "onTertiaryFixedVariant"
  | "onTertiaryFixed"
  | "onTertiary"
  | "outlineVariant"
  | "outline"
  | "primaryContainer"
  | "primaryFixedDim"
  | "primaryFixed"
  | "primary"
  | "scrim"
  | "secondaryContainer"
  | "secondaryFixedDim"
  | "secondaryFixed"
  | "secondary"
  | "shadow"
  | "surfaceBright"
  | "surfaceContainerHigh"
  | "surfaceContainerHighest"
  | "surfaceContainerLow"
  | "surfaceContainerLowest"
  | "surfaceContainer"
  | "surfaceDim"
  | "surfaceTint"
  | "surfaceVariant"
  | "surface"
  | "tertiaryContainer"
  | "tertiaryFixedDim"
  | "tertiaryFixed"
  | "tertiary";

type Props = {
  children: ReactNode;
  variant?: Variant;
  color?: ColorKey;
  slot?: TextProps["slot"];
};

export const Typography = forwardRef<HTMLSpanElement, Props>(
  ({ children, variant = "bodyMedium", color = "onSurface", slot }, ref) => {
    const toKebabCase = (str: string) => {
      return str.replace(/([A-Z])/g, "-$1").toLowerCase();
    };

    const className = styles[variant];
    const style = { color: `var(--md-sys-color-${toKebabCase(color)})` };

    if (slot) {
      return (
        <Text ref={ref} className={className} style={style} slot={slot}>
          {children}
        </Text>
      );
    }

    return (
      <span ref={ref} className={className} style={style}>
        {children}
      </span>
    );
  },
);

Typography.displayName = "Typography";
