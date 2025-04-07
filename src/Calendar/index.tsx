"use client";
import type { CalendarProps, CalendarVariant } from "./types";
import { SingleCalendar } from "./Single";
import { RangeCalendar } from "./Range";
import { MultipleCalendar } from "./Multiple";
import { isSingleVariant, isRangeVariant, isMultipleVariant } from "./modules";

// --- Component ---

export const Calendar = <T extends CalendarVariant = "single">(
  props: CalendarProps<T>,
) => {
  // 型ガードを使って型安全に実装
  if (isRangeVariant(props)) {
    return <RangeCalendar {...props} />;
  }

  if (isMultipleVariant(props)) {
    return <MultipleCalendar {...props} />;
  }

  // Default: single selection mode
  if (isSingleVariant(props)) {
    return <SingleCalendar {...props} />;
  }

  // TypeScriptの型チェックのために必要（実際には到達しない）
  throw new Error(`Unsupported calendar variant: ${props.variant}`);
};
