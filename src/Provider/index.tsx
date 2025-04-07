import type { ReactNode } from "react";
import {
  I18nProvider,
  type I18nProviderProps,
  OverlayProvider,
} from "react-aria";

export const Provider = ({
  children,
  locale,
}: { children: ReactNode; locale: I18nProviderProps["locale"] }) => {
  return (
    <I18nProvider locale={locale}>
      <OverlayProvider>{children}</OverlayProvider>
    </I18nProvider>
  );
};
