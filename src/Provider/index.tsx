import { type ReactNode, useMemo } from "react";
import {
  I18nProvider,
  type I18nProviderProps,
  OverlayProvider,
} from "react-aria";
import { ToastQueue } from "react-stately";
import { type SnackbarContent, SnackbarProvider } from "../Snackbar";

/**
 * Provider component that wraps the application with necessary context providers
 * from react-aria and other libraries. This includes internationalization (I18n),
 * overlay management, and Snackbar notifications.
 *
 * @param props - The properties for the Provider component.
 * @param props.children - The child elements to be rendered within the providers.
 * @param props.locale - The locale to be used for internationalization.
 */
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
