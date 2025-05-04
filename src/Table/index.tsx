"use client";
import { forwardRef } from "react";

// biome-ignore lint:
type Props = {
  // コンポーネントのプロパティをここに定義
};

export const Table = forwardRef<HTMLDivElement, Props>((_props, ref) => {
  return <div ref={ref}>Table</div>;
});
