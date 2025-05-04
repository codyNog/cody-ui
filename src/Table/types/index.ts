import type {
  ColumnDef,
  SortingState,
  PaginationState,
  ColumnFiltersState,
  RowSelectionState,
  VisibilityState,
  Updater,
  Row,
  ColumnOrderState as ColumnOrderStateType,
} from "@tanstack/react-table";
import type { ReactNode } from "react";

export type TableOperationMode = "client" | "server";

export type Id = string | number;
export type DataWithId = { id: Id };

type Filter =
  | ({
      key: string;
    } & {
      type: "text";
      value: string;
    })
  | {
      type: "number";
      value: number;
    }
  | {
      type: "date";
      value: Date;
    }
  | {
      type: "term";
      value: Date[];
    };

export interface TableProps<TData extends DataWithId> {
  // --- 基本データ ---
  /**
   * 表示するデータ配列。
   * operationMode が 'server' の場合は、現在のページに対応するデータのみを渡す。
   * rowDnd が有効な場合、この配列の順序が DnD 操作によって変更されることを想定。
   */
  data: TData[];
  /** カラム定義の配列 */
  // biome-ignore lint/suspicious/noExplicitAny: TanStack Table の ColumnDef の型定義との互換性のため
  columns: ColumnDef<TData, any>[];

  // --- 動作モード ---
  /**
   * テーブルの主要な操作 (ページネーション、ソート、フィルタ) を
   * クライアントサイドで行うか、サーバーサイドで行うか。
   * デフォルトは 'server'。
   */
  operationMode?: TableOperationMode;

  // --- 状態管理 (Controlled Props) ---
  /** ページネーション状態 (現在のページインデックスとページサイズ) */
  pagination?: PaginationState;
  /** ソート状態 */
  sorting?: SortingState;
  /** カラムフィルター状態 */
  columnFilters?: ColumnFiltersState;
  /** グローバル (キーワード) フィルター状態 */
  globalFilter?: string;
  /** 行選択状態 (キーは TData['id'] になる) */
  rowSelection?: RowSelectionState;
  /** 列の表示/非表示状態 */
  columnVisibility?: VisibilityState;
  /** 列の順序状態 (Controlled Prop) */
  columnOrder?: ColumnOrderStateType;

  // --- 状態変更コールバック ---
  /** ページネーション状態変更時に呼ばれる */
  onPaginationChange?: (updater: Updater<PaginationState>) => void;
  /** ソート状態変更時に呼ばれる */
  onSortingChange?: (updater: Updater<SortingState>) => void;
  /** カラムフィルター状態変更時に呼ばれる */
  onColumnFiltersChange?: (updater: Updater<ColumnFiltersState>) => void;
  /** グローバルフィルター状態変更時に呼ばれる */
  onGlobalFilterChange?: (updater: Updater<string>) => void;
  /** 行選択状態変更時に呼ばれる */
  onRowSelectionChange?: (updater: Updater<RowSelectionState>) => void;
  /** 列の表示/非表示状態変更時に呼ばれる */
  onColumnVisibilityChange?: (updater: Updater<VisibilityState>) => void;
  /**
   * 列の順序が DnD によって変更されたときに呼ばれる。
   * Tanstack Table の columnOrder state の Updater を渡す。
   */
  onColumnOrderChange?: (updater: Updater<ColumnOrderStateType>) => void;

  // --- サーバーサイド用情報 ---
  /**
   * 総ページ数。operationMode が 'server' の場合に必要。
   * Tanstack Table の pageCount オプションに渡される。
   */
  pageCount?: number;
  /**
   * または、総行数。pageCount の代わりにこちらを指定しても良い。
   * 内部で pageCount に変換される。
   */
  totalRowCount?: number;

  // --- 追加機能コールバック ---
  /**
   * CSVダウンロードボタンがクリックされたときに呼ばれる非同期関数。
   * この関数は、以下のプロパティを持つオブジェクトを解決する Promise を返す必要がある:
   *   - `data`: CSVとしてダウンロードするデータの配列 (オブジェクトの配列)。
   *   - `filenamePrefix` (任意): ダウンロードするファイル名のプレフィックス。指定しない場合は 'data' が使用される。
   * 例: `async () => { const data = await fetchCsvData(); return { data, filenamePrefix: 'my_report' }; }`
   * このプロパティが渡されると、CSVダウンロードボタンが表示される。
   */
  onCsvDownloadRequest?: () => Promise<{
    data: Record<string, unknown>[];
    filenamePrefix?: string;
  }>;
  /**
   * 行の順序が DnD によって変更されたときに呼ばれる。
   * 引数には、移動した行の ID (`activeId`) と、
   * 移動先の行の ID (`overId`) または null (リスト外への移動など) を渡す。
   * **重要:** このコールバック内で、渡された情報をもとに `data` プロパティに渡す配列を更新し、
   * コンポーネントを再レンダリングする必要があります。
   */
  onRowOrderChange?: (activeId: string, overId: string | null) => void;

  // --- スタイリング・その他 ---
  /** ルート要素に適用するカスタムクラス名 */
  className?: string;
  /** テーブルのキャプション (アクセシビリティ向上のため推奨) */
  caption?: ReactNode;
  /** ローディング状態表示 */
  isLoading?: boolean;
  /** エラー状態表示 */
  isError?: boolean;
  /** データがない場合の表示内容 */
  noDataMessage?: ReactNode;
  /** Tanstack Table の `getRowId` オプション。デフォルトは `row => row.id` */
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  filter?: Filter[];
  onFilterChange?: (filter: Filter[]) => Promise<void>;
}
