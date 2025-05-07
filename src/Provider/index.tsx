import { type ReactNode, useMemo } from "react";
import {
  I18nProvider,
  type I18nProviderProps,
  OverlayProvider,
} from "react-aria";
import { ToastQueue } from "react-stately";
import { type SnackbarContent, SnackbarProvider } from "../Snackbar";

export const Provider = ({
  children,
  locale,
}: { children: ReactNode; locale: I18nProviderProps["locale"] }) => {
  const queue = useMemo(() => new ToastQueue<SnackbarContent>(), []);

  return (
    <I18nProvider locale={locale}>
      <OverlayProvider>
        <SnackbarProvider queue={queue}>{children}</SnackbarProvider>
      </OverlayProvider>
    </I18nProvider>
  );
};
