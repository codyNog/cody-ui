import { Time, getLocalTimeZone, now } from "@internationalized/date";
import { useId, useLayoutEffect, useRef, useState } from "react";
import type * as React from "react";
import type { TimeValue } from "react-aria-components";
import type { Props } from "../types";

export const useTimePicker = (props: Props) => {
  const {
    label,
    errorMessage,
    isDisabled,
    isRequired,
    value: controlledValue,
    onChange: controlledOnChange,
    granularity = "minute",
    variant,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const dialogId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState<TimeValue | null>(
    null,
  );
  const [dialogValue, setDialogValue] = useState<TimeValue | null>(null);
  const [mode, setMode] = useState<"input" | "dial">("input");
  const [dialMode, setDialMode] = useState<"hour" | "minute">("hour");

  const value =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;
  const onChange = (newValue: TimeValue) => {
    if (controlledOnChange) {
      controlledOnChange(newValue);
    }
    if (controlledValue === undefined) {
      setUncontrolledValue(newValue);
    }
  };

  const [isLandscape, setIsLandscape] = useState(false);
  const displayFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const dialRef = useRef<HTMLDivElement | null>(null);
  const [dialVisualRadius, setDialVisualRadius] = useState(108);
  const [actualDialWidth, setActualDialWidth] = useState(256);
  const [buttonPositions, setButtonPositions] = useState<React.CSSProperties[]>(
    [],
  );
  const isDraggingRef = useRef(false);

  const currentHour24 = dialogValue ? dialogValue.hour : 0;
  const currentMinute = dialogValue ? dialogValue.minute : 0;
  const currentSecond = dialogValue ? dialogValue.second : 0;

  const dialDisplayHours = Array.from(
    { length: 12 },
    (_, i) => (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
  );
  const minutesArray = Array.from({ length: 12 }, (_, i) => i * 5);

  useLayoutEffect(() => {
    if (dialRef.current) {
      const offsetWidth = dialRef.current.offsetWidth;
      setActualDialWidth(offsetWidth);
      const buttonSize = 40; // TODO: 定数管理
      setDialVisualRadius(offsetWidth / 2 - buttonSize / 2);
    }
  }, []);

  useLayoutEffect(() => {
    const calculatePositions = (
      count: number,
      radius: number,
      dialPlateWidth: number,
      startAngleOffset = -90,
    ) => {
      const positions: React.CSSProperties[] = [];
      const angleStep = 360 / count;
      const buttonSize = 40; // TODO: 定数管理

      for (let i = 0; i < count; i++) {
        const angle = startAngleOffset + i * angleStep;
        const relativeCenterX = radius * Math.cos((angle * Math.PI) / 180);
        const relativeCenterY = radius * Math.sin((angle * Math.PI) / 180);
        const absoluteCenterX = dialPlateWidth / 2 + relativeCenterX;
        const absoluteCenterY = dialPlateWidth / 2 + relativeCenterY;
        const absoluteButtonLeftX = absoluteCenterX - buttonSize / 2;
        const absoluteButtonTopY = absoluteCenterY - buttonSize / 2;
        positions.push({
          transform: `translate(${absoluteButtonLeftX}px, ${absoluteButtonTopY}px)`,
        });
      }
      return positions;
    };

    if (dialMode === "hour") {
      setButtonPositions(
        calculatePositions(
          dialDisplayHours.length,
          dialVisualRadius,
          actualDialWidth,
        ),
      );
    } else if (dialMode === "minute" && granularity === "minute") {
      setButtonPositions(
        calculatePositions(
          minutesArray.length,
          dialVisualRadius,
          actualDialWidth,
        ),
      );
    }
  }, [
    dialMode,
    dialVisualRadius,
    actualDialWidth,
    dialDisplayHours.length,
    minutesArray.length,
    granularity,
  ]);

  const handleInteraction = (
    event: React.MouseEvent | React.TouchEvent | MouseEvent,
  ) => {
    if (!dialRef.current) return;

    const dialRect = dialRef.current.getBoundingClientRect();
    const dialCenterX = dialRect.left + dialRect.width / 2;
    const dialCenterY = dialRect.top + dialRect.height / 2;

    let clientX: number;
    let clientY: number;
    if ("touches" in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const deltaX = clientX - dialCenterX;
    const deltaY = clientY - dialCenterY;

    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360;

    if (dialMode === "hour") {
      const hour = Math.round(angle / 30) % 12;
      const newHour12 = hour === 0 ? 12 : hour;

      let newHour24: number;
      const isCurrentlyPm = currentHour24 >= 12;

      if (isCurrentlyPm) {
        if (newHour12 === 12) {
          newHour24 = 12;
        } else {
          newHour24 = newHour12 + 12;
        }
      } else {
        if (newHour12 === 12) {
          newHour24 = 0;
        } else {
          newHour24 = newHour12;
        }
      }
      if (value?.hour !== newHour24) {
        setDialogValue(new Time(newHour24, currentMinute, currentSecond));
      }
    } else if (dialMode === "minute" && granularity === "minute") {
      const minute = Math.round(angle / 6) % 60;
      const nearestFive = (Math.round(minute / 5) * 5) % 60;
      if (value?.minute !== nearestFive) {
        setDialogValue(new Time(currentHour24, nearestFive, currentSecond));
      }
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button !== 0) return;
    isDraggingRef.current = true;
    handleInteraction(event);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDraggingRef.current) return;
    handleInteraction(event);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    isDraggingRef.current = true;
    handleInteraction(event);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    handleInteraction(event);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const handleDialHourSelect = (
    hour12: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
  ) => {
    let newHour24: number;
    const isCurrentlyPm = currentHour24 >= 12;

    if (isCurrentlyPm) {
      if (hour12 === 12) {
        newHour24 = 12;
      } else {
        newHour24 = hour12 + 12;
      }
    } else {
      if (hour12 === 12) {
        newHour24 = 0;
      } else {
        newHour24 = hour12;
      }
    }
    setDialogValue(new Time(newHour24, currentMinute, currentSecond));
  };

  const handleMinuteChange = (minute: number) => {
    setDialogValue(new Time(currentHour24, minute, currentSecond));
  };

  const hourAngle = (currentHour24 % 12) * 30;
  const minuteAngle = currentMinute * 6;

  const handleOpen = () => {
    if (!isDisabled) {
      const initialDialogValue = value || now(getLocalTimeZone());
      setDialogValue(
        new Time(
          initialDialogValue.hour,
          initialDialogValue.minute,
          initialDialogValue.second,
        ),
      );
      setIsOpen(true);
    }
    if (mode === "dial") {
      setDialMode("hour");
    }
  };

  const handleConfirm = () => {
    if (dialogValue) {
      onChange(dialogValue);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleTimeChangeInDialog = (newValue: TimeValue | Time | null) => {
    if (newValue instanceof Time) {
      setDialogValue(newValue);
    } else if (newValue === null) {
      // nullの場合は一旦何もしない (TimePickerがnullを許容する場合、onChangeの型変更が必要)
    } else {
      // newValue は TimeValue 型のはず
      setDialogValue(
        new Time(newValue.hour, newValue.minute, newValue.second ?? 0),
      );
    }
  };

  const handleAmPmChange = (newIsPm: boolean) => {
    if (dialogValue) {
      let currentHour = dialogValue.hour;
      const currentMinuteValue = dialogValue.minute;
      const currentSecondValue = dialogValue.second;
      const isCurrentlyPm = currentHour >= 12;
      if (newIsPm && !isCurrentlyPm) {
        currentHour = (currentHour % 12) + 12;
      } else if (!newIsPm && isCurrentlyPm) {
        currentHour %= 12;
      }
      if (newIsPm && currentHour === 0) currentHour = 12;
      if (!newIsPm && currentHour === 12 && !newIsPm) currentHour = 0;
      setDialogValue(
        new Time(currentHour, currentMinuteValue, currentSecondValue),
      );
    }
  };

  useLayoutEffect(() => {
    const checkScreenOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    checkScreenOrientation();
    window.addEventListener("resize", checkScreenOrientation);
    return () => {
      window.removeEventListener("resize", checkScreenOrientation);
    };
  }, []);

  return {
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
    minutes: minutesArray,
    handleDialHourSelect,
    handleMinuteChange,
    hourAngle,
    minuteAngle,
    currentHour24,
    currentMinute,
    dialMode,
    setDialMode,
  };
};
