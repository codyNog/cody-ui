"use client";
import {
  type ChangeEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
  forwardRef,
  useState,
} from "react";
import { useLongPress } from "react-aria";
import { MdSend } from "react-icons/md";
import { Typography } from "../Typography";
import styles from "./index.module.css";

/**
 * Props for the Chat.Root component.
 */
type ChatRootProps = {
  /** The content of the chat root. Typically includes Chat.MessageArea and Chat.InputArea. */
  children: ReactNode;
  /** Optional CSS class name for custom styling. */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

/**
 * The root container for the chat interface.
 * This component wraps all other chat elements.
 */
const Root = forwardRef<HTMLDivElement, ChatRootProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.root ?? ""} ${className ?? ""}`.trim()}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
Root.displayName = "Chat.Root";

/**
 * Props for the Chat.Message component.
 */
type ChatMessageProps = {
  /** The main content of the message. */
  children: ReactNode;
  /** Additional information displayed below the message content, such as read status. */
  description?: ReactNode;
  /** If true, the message is styled as a sender's message. Otherwise, it's styled as a receiver's message. */
  isSender?: boolean;
  /** The timestamp of the message. Can be a string or a Date object. */
  timestamp?: string | Date;
  /** The status of the message, e.g., "sending", "sent", "delivered", "read", "failed". */
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
  /** Optional CSS class name for custom styling. */
  className?: string;
  /** Callback fired when the context menu is triggered (e.g., right-click). */
  onContextMenu?: (event: MouseEvent<HTMLDivElement>) => void;
  /** Callback fired when a long press is detected on the message. */
  onLongPress?: () => void;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Represents a single message within the chat.
 * It can be styled differently based on whether it's from the sender or receiver.
 */
const Message = forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    {
      children,
      description,
      isSender,
      timestamp,
      status,
      className,
      onContextMenu,
      onLongPress,
      ...rest
    },
    ref,
  ) => {
    const messageStyles = `${styles.message ?? ""} ${
      isSender ? (styles.sender ?? "") : (styles.receiver ?? "")
    } ${className ?? ""}`.trim();

    const formattedTimestamp =
      timestamp instanceof Date
        ? timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : typeof timestamp === "string"
          ? timestamp
          : null;

    const { longPressProps } = useLongPress({
      onLongPress: (e) => {
        if (e.pointerType !== "mouse" && onLongPress) {
          onLongPress();
        }
      },
    });

    const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
      if (onContextMenu) {
        onContextMenu(event);
      }
    };

    return (
      <div
        ref={ref}
        className={messageStyles}
        onContextMenu={handleContextMenu}
        {...longPressProps}
        {...rest}
      >
        <div className={styles.messageBubble}>
          <Typography variant="bodyMedium">{children}</Typography>
        </div>
        {(formattedTimestamp || description) && (
          <div className={styles.messageMeta}>
            {description && (
              <Typography variant="labelSmall" color="onSurfaceVariant">
                {description}
              </Typography>
            )}
            {formattedTimestamp && (
              <Typography variant="labelSmall" color="onSurfaceVariant">
                {formattedTimestamp}
              </Typography>
            )}
          </div>
        )}
      </div>
    );
  },
);
Message.displayName = "Chat.Message";

/**
 * Props for the Chat.TypingIndicator component.
 */
type ChatTypingIndicatorProps = {
  /** If true, the typing indicator is styled as the sender's. Otherwise, it's styled as the receiver's. */
  isSender?: boolean;
  /** Optional CSS class name for custom styling. */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Displays a typing animation to indicate that a user is currently typing.
 */
const TypingIndicator = forwardRef<HTMLDivElement, ChatTypingIndicatorProps>(
  ({ isSender, className, ...rest }, ref) => {
    const indicatorStyles = `${styles.typingIndicator ?? ""} ${
      isSender ? (styles.sender ?? "") : (styles.receiver ?? "")
    } ${className ?? ""}`.trim();

    return (
      <div ref={ref} className={indicatorStyles} {...rest}>
        <div className={styles.typingDot} />
        <div className={styles.typingDot} />
        <div className={styles.typingDot} />
      </div>
    );
  },
);
TypingIndicator.displayName = "Chat.TypingIndicator";

/**
 * Props for the Chat.InputArea component.
 */
type ChatInputAreaProps = {
  /** The current value of the input field (controlled). */
  value?: string;
  /** Callback fired when the input value changes. */
  onChange?: (value: string) => void;
  /** Callback fired when the send button is clicked or Enter is pressed. */
  onSend: (value: string) => void;
  /** Placeholder text for the input field. */
  placeholder?: string;
  /** If true, the input area is disabled. */
  disabled?: boolean;
  /** Custom content for the send button. Defaults to a send icon. */
  sendButtonContent?: ReactNode;
  /** Accessory content to display before the input field. */
  leadingAccessory?: ReactNode;
  /** Accessory content to display after the input field but before the send button. */
  trailingAccessory?: ReactNode;
  /** Maximum number of characters allowed in the input field. */
  maxLength?: number;
  /** Optional CSS class name for the input element. */
  inputClassName?: string;
  /** Optional CSS class name for the send button. */
  sendButtonClassName?: string;
  /** Optional CSS class name for the input area container. */
  className?: string;
  /** Ref for the input element. */
  inputRef?: Ref<HTMLTextAreaElement>;
  /** Ref for the send button element. */
  buttonRef?: Ref<HTMLButtonElement>;
} & Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

/**
 * Provides the text input field and send button for the chat interface.
 */
const InputArea = forwardRef<HTMLDivElement, ChatInputAreaProps>(
  (
    {
      value: controlledValue,
      onChange: onControlledChange,
      onSend,
      placeholder,
      disabled,
      sendButtonContent = <MdSend />,
      leadingAccessory,
      trailingAccessory,
      maxLength,
      inputClassName,
      sendButtonClassName,
      className,
      inputRef,
      buttonRef,
      ...rest
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(
      controlledValue !== undefined ? controlledValue : "",
    );
    const currentValue =
      controlledValue !== undefined ? controlledValue : internalValue;

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      // Update rows based on content
      const newRows = newValue.split("\n").length;
      e.target.rows = newRows > 0 ? newRows : 1;

      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onControlledChange?.(newValue);
    };

    const handleSend = () => {
      if (currentValue.trim() && !disabled) {
        onSend(currentValue.trim());
        if (controlledValue === undefined) {
          setInternalValue("");
          // Reset rows to 1 after sending if inputRef is available
          if (inputRef && "current" in inputRef && inputRef.current) {
            inputRef.current.rows = 1;
          }
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSend();
      }
    };

    return (
      <div
        ref={ref}
        className={`${styles.inputArea ?? ""} ${className ?? ""}`.trim()}
        {...rest}
      >
        {leadingAccessory}
        <textarea
          ref={inputRef}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`${styles.input ?? ""} ${inputClassName ?? ""}`.trim()}
          rows={1} // 初期表示は1行
        />
        {trailingAccessory}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleSend}
          disabled={disabled || !currentValue.trim()}
          className={`${styles.sendButton ?? ""} ${
            sendButtonClassName ?? ""
          }`.trim()}
        >
          {sendButtonContent}
        </button>
      </div>
    );
  },
);
InputArea.displayName = "Chat.InputArea";

export const Chat = {
  Root,
  Message,
  InputArea,
  TypingIndicator,
};
