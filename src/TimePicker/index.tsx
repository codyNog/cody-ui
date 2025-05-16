"use client";
import { Time } from "@internationalized/date";
import { forwardRef } from "react";
import type { TimeValue } from "react-aria-components";
import {
  Button as AriaButton,
  DateInput,
  DateSegment,
  Dialog,
  FieldError,
  Group,
  Modal,
  ModalOverlay,
  TimeField,
  ToggleButton,
} from "react-aria-components";
import { MdAccessTime, MdKeyboard, MdSchedule } from "react-icons/md";
import { Button } from "../Button";
import { TextField } from "../TextField";
import type { Props as TextFieldProps } from "../TextField/types";
import { Typography } from "../Typography";
import { useTimePicker } from "./hooks";
import styles from "./index.module.css";

type Props = {
  label?: string;
  description?: string;
  errorMessage?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  value?: TimeValue | null;
  onChange?: (value: TimeValue) => void;
  /**
   * The granularity of the time field.
   * @default "minute"
   */
  granularity?: "hour" | "minute";
  variant?: TextFieldProps["variant"];
};

export const TimePicker = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    isOpen,
    dialogId,
    handleOpen,
    handleCancel,
    handleConfirm,
    dialogValue,
    handleTimeChangeInDialog,
    handleAmPmChange,
    mode,
    setMode,
    isLandscape,
    displayFormatter,
    isDisabled,
    isRequired,
    value,
    granularity,
    variant,
    label,
    errorMessage,
    setIsOpen,
    dialRef,
    buttonPositions,
    handleMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    dialDisplayHours,
    minutes,
    handleDialHourSelect,
    handleMinuteChange,
    hourAngle,
    minuteAngle,
    currentHour24,
    currentMinute,
    dialMode,
    setDialMode,
  } = useTimePicker(props);

  return (
    <>
      <Group ref={ref} className={styles.group}>
        <div
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-disabled={isDisabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? dialogId : undefined}
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              handleOpen();
            }
          }}
          className={styles.textFieldTriggerWrapper}
        >
          <TextField
            startAdornment={<MdAccessTime />}
            value={
              value instanceof Time
                ? displayFormatter.format(
                    new Date(
                      0,
                      0,
                      0,
                      value.hour,
                      value.minute,
                      value.second || 0,
                    ),
                  )
                : ""
            }
            label={label}
            isReadOnly
            isDisabled={isDisabled}
            isRequired={isRequired}
            variant={variant}
          />
        </div>
        {errorMessage && (
          <FieldError className={styles.errorMessage}>
            {errorMessage}
          </FieldError>
        )}
      </Group>

      <ModalOverlay
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCancel();
          } else {
            setIsOpen(open);
          }
        }}
        isDismissable
        className={styles.modalOverlay}
      >
        <Modal className={styles.modal}>
          <Dialog
            aria-label="time picker"
            id={dialogId}
            className={`${styles.dialog} ${
              isLandscape
                ? styles.dialogLandscapeMaxWidth
                : styles.dialogPortraitMaxWidth
            }`}
          >
            <>
              <div className={styles.dialogHeader}>
                <Typography variant="bodyMedium">
                  {mode === "input" ? "時刻を入力" : "時刻を選択"}
                </Typography>
              </div>
              <div
                className={`${styles.dialogContent} ${
                  isLandscape ? styles.dialogContentLandscape : ""
                }`}
              >
                <div className={styles.timeInputContainer}>
                  <TimeField
                    aria-label={props.label || "時刻入力"}
                    value={dialogValue}
                    onChange={handleTimeChangeInDialog}
                    granularity={granularity}
                    hourCycle={12}
                    isDisabled={isDisabled}
                    className={styles.dialogTimeField}
                  >
                    <DateInput className={styles.dialogDateInput}>
                      {(segment) => {
                        if (
                          segment.type === "hour" ||
                          segment.type === "minute" ||
                          (segment.type === "second" &&
                            granularity !== "minute" &&
                            granularity !== "hour")
                        ) {
                          return (
                            <div
                              className={styles.segmentContainer}
                              onFocus={() => {
                                if (segment.type === "hour") {
                                  setDialMode("hour");
                                } else if (segment.type === "minute") {
                                  setDialMode("minute");
                                }
                              }}
                            >
                              <DateSegment
                                segment={segment}
                                className={styles.dialogSegment}
                              />
                              {mode === "input" && (
                                <Typography
                                  variant="labelLarge"
                                  color="onSurfaceVariant"
                                >
                                  {segment.type === "hour"
                                    ? "時"
                                    : segment.type === "minute"
                                      ? "分"
                                      : "秒"}
                                </Typography>
                              )}
                            </div>
                          );
                        }
                        if (
                          segment.type === "literal" &&
                          segment.text === ":"
                        ) {
                          return (
                            <span
                              aria-hidden="true"
                              className={styles.dialogLiteral}
                            >
                              {segment.text}
                            </span>
                          );
                        }
                        return <></>; // それ以外のセグメントは表示しない
                      }}
                    </DateInput>
                  </TimeField>
                  <div className={styles.amPmToggleContainer}>
                    <ToggleButton
                      isSelected={
                        dialogValue
                          ? dialogValue.hour < 12 ||
                            (dialogValue.hour === 0 &&
                              dialogValue.minute === 0 &&
                              dialogValue.second === 0)
                          : true
                      }
                      onChange={() => handleAmPmChange(false)}
                      className={styles.amPmButton}
                    >
                      AM
                    </ToggleButton>
                    <ToggleButton
                      isSelected={
                        dialogValue
                          ? dialogValue.hour >= 12 &&
                            !(
                              dialogValue.hour === 0 &&
                              dialogValue.minute === 0 &&
                              dialogValue.second === 0
                            )
                          : false
                      }
                      onChange={() => handleAmPmChange(true)}
                      className={styles.amPmButton}
                    >
                      PM
                    </ToggleButton>
                  </div>
                </div>
                {mode === "dial" && (
                  <div className={styles.clockDialContainer}>
                    <div
                      ref={dialRef}
                      className={styles.dial}
                      onMouseDown={handleMouseDown}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <div className={styles.clockHands}>
                        {dialMode === "hour" && (
                          <div
                            className={styles.hourHand}
                            style={{ transform: `rotate(${hourAngle}deg)` }}
                          />
                        )}
                        {dialMode === "minute" && granularity === "minute" && (
                          <div
                            className={styles.minuteHand}
                            style={{ transform: `rotate(${minuteAngle}deg)` }}
                          />
                        )}
                        <div className={styles.handPivot} />
                      </div>
                      {dialMode === "hour" && (
                        <div className={styles.hourDial}>
                          {dialDisplayHours.map((h_1_to_12) => {
                            let isActive = false;
                            const adjustedCurrentHour =
                              currentHour24 % 12 === 0
                                ? 12
                                : currentHour24 % 12;
                            isActive = h_1_to_12 === adjustedCurrentHour;

                            const positionIndex =
                              h_1_to_12 === 12 ? 0 : h_1_to_12;

                            return (
                              <button
                                type="button"
                                key={`hour-${h_1_to_12}`}
                                className={`${styles.dialButton} ${
                                  isActive ? styles.selected : ""
                                }`}
                                onClick={() => handleDialHourSelect(h_1_to_12)}
                                style={buttonPositions[positionIndex]}
                              >
                                {h_1_to_12}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {dialMode === "minute" && granularity === "minute" && (
                        <div className={styles.minuteDial}>
                          {minutes.map((m) => {
                            const positionIndexForMinute = m / 5;

                            return (
                              <button
                                type="button"
                                key={`minute-${m}`}
                                className={`${styles.dialButton} ${
                                  m === currentMinute ? styles.selected : ""
                                }`}
                                onClick={() => handleMinuteChange(m)}
                                style={buttonPositions[positionIndexForMinute]}
                              >
                                {String(m).padStart(2, "0")}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.dialogActions}>
                <AriaButton
                  aria-label={
                    mode === "input"
                      ? "時計表示に切り替え"
                      : "入力表示に切り替え"
                  }
                  onPress={() => {
                    setMode((prevMode) =>
                      prevMode === "input" ? "dial" : "input",
                    );
                  }}
                  className={styles.dialogModeToggle}
                >
                  {mode === "input" ? <MdSchedule /> : <MdKeyboard />}
                </AriaButton>
                <div className={styles.dialogConfirmActions}>
                  <Button
                    variant="text"
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    キャンセル
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => {
                      handleConfirm();
                    }}
                  >
                    決定
                  </Button>
                </div>
              </div>
            </>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </>
  );
});
