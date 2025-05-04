import type { Meta, StoryObj } from "@storybook/react";
import { Table } from ".";
import {
  createColumnHelper,
  type PaginationState,
  type ColumnOrderState, // ColumnOrderState をインポート
  type Updater, // Updater もインポートしておく
} from "@tanstack/react-table";
import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable"; // arrayMove をインポート

const meta = {
  component: Table,
  argTypes: {
    operationMode: { control: "radio", options: ["client", "server"] },
    isLoading: { control: "boolean" },
    isError: { control: "boolean" },
  },
} satisfies Meta<typeof Table>;

export default meta;

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultData: Person[] = [
  {
    id: 1,
    firstName: "tanner",
    lastName: "linsley",
    age: 33,
    visits: 100,
    status: "In Relationship",
    progress: 50,
  },
  {
    id: 2,
    firstName: "kevin",
    lastName: "vay",
    age: 28,
    visits: 200,
    status: "Single",
    progress: 80,
  },
  {
    id: 3,
    firstName: "john",
    lastName: "doe",
    age: 45,
    visits: 50,
    status: "Complicated",
    progress: 10,
  },
  {
    id: 4,
    firstName: "jane",
    lastName: "doe",
    age: 42,
    visits: 150,
    status: "Single",
    progress: 70,
  },
  {
    id: 5,
    firstName: "sam",
    lastName: "smith",
    age: 25,
    visits: 300,
    status: "In Relationship",
    progress: 90,
  },
  {
    id: 6,
    firstName: "alex",
    lastName: "brown",
    age: 30,
    visits: 120,
    status: "Single",
    progress: 60,
  },
  {
    id: 7,
    firstName: "chris",
    lastName: "green",
    age: 35,
    visits: 80,
    status: "Complicated",
    progress: 30,
  },
  {
    id: 8,
    firstName: "pat",
    lastName: "jones",
    age: 22,
    visits: 250,
    status: "Single",
    progress: 75,
  },
  {
    id: 9,
    firstName: "taylor",
    lastName: "davis",
    age: 38,
    visits: 180,
    status: "In Relationship",
    progress: 40,
  },
  {
    id: 10,
    firstName: "morgan",
    lastName: "miller",
    age: 29,
    visits: 90,
    status: "Single",
    progress: 20,
  },
  {
    id: 11,
    firstName: "casey",
    lastName: "wilson",
    age: 31,
    visits: 110,
    status: "Complicated",
    progress: 55,
  },
  {
    id: 12,
    firstName: "jordan",
    lastName: "moore",
    age: 27,
    visits: 220,
    status: "Single",
    progress: 85,
  },
  {
    id: 13,
    firstName: "jamie",
    lastName: "thomas",
    age: 32,
    visits: 130,
    status: "In Relationship",
    progress: 65,
  },
  {
    id: 14,
    firstName: "drew",
    lastName: "jackson",
    age: 26,
    visits: 190,
    status: "Single",
    progress: 78,
  },
  {
    id: 15,
    firstName: "blake",
    lastName: "white",
    age: 40,
    visits: 70,
    status: "Complicated",
    progress: 25,
  },
];

const columnHelper = createColumnHelper<Person>();
const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
    id: "id",
  }),
  columnHelper.accessor("firstName", {
    header: "名",
    cell: (info) => info.getValue(),
    id: "firstName",
  }),
  columnHelper.accessor("lastName", {
    header: "姓",
    cell: (info) => info.getValue(),
    id: "lastName",
  }),
  columnHelper.accessor("age", {
    header: "年齢",
    cell: (info) => info.getValue(),
    id: "age",
  }),
  columnHelper.accessor("visits", {
    header: "訪問数",
    cell: (info) => info.getValue(),
    id: "visits",
  }),
  columnHelper.accessor("status", {
    header: "ステータス",
    cell: (info) => info.getValue(),
    id: "status",
  }),
  columnHelper.accessor("progress", {
    header: "進捗",
    cell: (info) => info.getValue(),
    id: "progress",
  }),
];

type BaseStory = StoryObj<typeof Table<Person>>;

export const Default: BaseStory = {
  args: {
    data: defaultData.slice(0, 10),
    columns: columns,
    caption: "基本的なテーブル (ページネーション付き)",
    pagination: { pageIndex: 0, pageSize: 10 },
  },
  render: (args) => {
    const [pagination, setPagination] = useState<PaginationState>(
      args.pagination ?? { pageIndex: 0, pageSize: 10 },
    );

    const handlePaginationChange = (updater: Updater<PaginationState>) => {
      setPagination(updater);
    };

    const pageCount = Math.ceil(defaultData.length / pagination.pageSize);
    const currentPageData = defaultData.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize,
    );

    return (
      <Table<Person>
        {...args}
        columns={args.columns} // columns を渡す
        data={currentPageData}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        pageCount={pageCount}
      />
    );
  },
};

// --- 全機能有効化ストーリー ---
type Story = StoryObj<typeof Table<Person>>;

export const AllFeatures: Story = {
  args: {
    columns: columns,
    caption: "全機能テーブル (行/列 DnD, ページネーション, CSVダウンロード)", // キャプション更新
  },
  render: (args) => {
    const [data, setData] = useState<Person[]>(defaultData);
    const initialColumnOrder = columns.map((c) => c.id ?? "");
    const [columnOrder, setColumnOrder] =
      useState<ColumnOrderState>(initialColumnOrder);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

    const handleRowOrderChange = (activeId: string, overId: string | null) => {
      if (!overId) return;
      setData((prevData) => {
        const oldIndex = prevData.findIndex(
          (row) => String(row.id) === activeId,
        );
        const newIndex = prevData.findIndex((row) => String(row.id) === overId);
        if (oldIndex === -1 || newIndex === -1) return prevData;
        return arrayMove(prevData, oldIndex, newIndex);
      });
    };

    const handleColumnOrderChange = (updater: Updater<ColumnOrderState>) => {
      setColumnOrder(updater);
    };

    const handlePaginationChange = (updater: Updater<PaginationState>) => {
      setPagination(updater);
    };

    // CSVダウンロードリクエストハンドラ
    const handleCsvDownloadRequest = async () => {
      console.log(
        "CSVダウンロードリクエストを受け付けました。データを準備します...",
      );
      // 1秒待機して非同期処理を模倣
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("データ準備完了。CSVを生成します。");

      // 現在の全データを返す (ページネーションの影響を受けない元のデータ)
      // 必要に応じてここでデータを加工したり、特定のカラムだけを選んだりできる
      const csvExportData = data.map((person) => ({
        ID: person.id,
        FullName: `${person.firstName} ${person.lastName}`, // 例: 姓と名を結合
        Age: person.age,
        Status: person.status,
        Progress: person.progress, // 進捗も追加
      }));
      return { data: csvExportData, filenamePrefix: "all_features_data" };
    };

    // 注意: 行 DnD は全データに対して行うため、ページネーション前の data を更新する
    const pageCount = Math.ceil(data.length / pagination.pageSize);
    const currentPageData = data.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize,
    );

    return (
      <Table<Person>
        {...args}
        columns={args.columns}
        data={currentPageData}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        pageCount={pageCount}
        columnOrder={columnOrder}
        onColumnOrderChange={handleColumnOrderChange}
        // 行 DnD は全データに対して行うので、currentPageData ではなく元の data を更新する handleRowOrderChange を渡す
        onRowOrderChange={handleRowOrderChange}
        // CSVダウンロードハンドラを追加
        onCsvDownloadRequest={handleCsvDownloadRequest}
      />
    );
  },
};
