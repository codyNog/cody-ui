# M3 Select (改訂版) 開発計画

## 1. 情報収集フェーズ (変更なし)

*   M3の "Menus" のドキュメントを熟読する。トランジションと「Menu with filter」を重点的に。
*   既存の [`TextField`](src/TextField/index.tsx) と [`Menu`](src/Menu/index.tsx) の実装を再確認する。

## 2. 設計フェーズ (シンプルに！)

*   **基本構造:**
    *   `Select` コンポーネントは、内部で [`TextField`](src/TextField/index.tsx) と [`Menu`](src/Menu/index.tsx) コンポーネントを組み合わせる。
    *   [`Menu`](src/Menu/index.tsx) コンポーネントの `children` prop ([`src/Menu/index.tsx:52`](src/Menu/index.tsx:52)) に、カスタマイズした [`TextField`](src/TextField/index.tsx) (これがトリガーになる) を渡す。
    *   [`TextField`](src/TextField/index.tsx) の右側には、開閉状態を示す矢印アイコン (▼/▲) を表示する。
*   **スタイリングとトランジション (変更なし):**
    *   M3のドキュメントに基づいた詳細なトランジションを実装する。
        *   Menu開時: リストのフェードイン＆スライド、区切り線の変化、ラベルのスケールアップ、矢印の切り替え。
        *   アイテム選択時: リップル、選択テキストのフェードイン、Menuのフェードアウト、矢印の切り替え。
*   **機能 (変更なし):**
    *   [`Menu`](src/Menu/index.tsx) の `onAction` ([`src/Menu/index.tsx:59`](src/Menu/index.tsx:59)) を利用して選択された値を [`TextField`](src/TextField/index.tsx) に反映させる。
    *   オプションでフィルタリング機能。
*   **Props (変更なし):**
    *   `items`: 表示する選択肢のデータ。
    *   `value`, `defaultValue`, `onChange`: 選択値を管理。
    *   `variant`: 'filled' または 'outlined'。
    *   `label`, `leadingIcon`, `trailingIcon`, `helperText`, `errorText`, `disabled` など。
    *   `filterable`: 検索フィルター有効化フラグ。
*   **アクセシビリティ (変更なし):**
    *   `react-aria-components` のフック利用検討、または手動でARIA属性設定。

## 3. 実装フェーズ (別モードで実施 - よりシンプルに)

*   `npm run plop ui Select` でコンポーネントの土台作成。
*   `Select` コンポーネント内で、[`TextField`](src/TextField/index.tsx) コンポーネントと [`Menu`](src/Menu/index.tsx) コンポーネントをインスタンス化し、適切にPropsを連携させる。
    *   [`Menu`](src/Menu/index.tsx) の `children` には、状態（開いているか、選択されている値など）に応じて見た目が変わるようにした [`TextField`](src/TextField/index.tsx) を渡す。
*   M3のドキュメントに基づいたスタイリングとトランジションを実装する。
*   選択ロジック、フィルタリング機能を実装する。

## 4. Storybook作成フェーズ (変更なし)

*   各種パターンのストーリーを作成する。

## Mermaid図 (コンポーネント構成案 - 改訂版)

```mermaid
graph TD
    subgraph M3_Select_Revised [M3 Select (Uses Existing TextField & Menu)]
        direction LR
        style M3_Select_Revised fill:#f9f,stroke:#333,stroke-width:2px

        Wrapper["Select Wrapper (Manages State)"]
        style Wrapper fill:#ddd,stroke:#333

        ConfiguredTextField["Configured TextField (as Trigger)"]
        style ConfiguredTextField fill:#ccf,stroke:#333
        ConfiguredMenu["Configured Menu (Handles Popover & Items)"]
        style ConfiguredMenu fill:#eef,stroke:#333

        DropdownArrow_R["Dropdown Arrow (▼/▲ on TextField)"]
        style DropdownArrow_R fill:#cfc,stroke:#333
        SelectedValueDisplay_R["Selected Value (in TextField)"]
        style SelectedValueDisplay_R fill:#ffc,stroke:#333
        FloatingLabel_R["Floating Label (on TextField, scales & moves)"]
        style FloatingLabel_R fill:#fcc,stroke:#333

        Wrapper --> ConfiguredTextField
        Wrapper -- "Passes items & handles onAction" --> ConfiguredMenu
        ConfiguredMenu -- "children prop receives" --> ConfiguredTextField


        ConfiguredTextField --> DropdownArrow_R
        ConfiguredTextField --> SelectedValueDisplay_R
        ConfiguredTextField --> FloatingLabel_R
    end

    subgraph Core_Existing_Components [Core Existing Components Used]
        direction TB
        style Core_Existing_Components fill:#eee,stroke:#666,stroke-width:2px,color:#333

        ExistingTextField["src/TextField"]
        ExistingMenu["src/Menu"]

        ConfiguredTextField -- "Is an instance of" --> ExistingTextField
        ConfiguredMenu -- "Is an instance of" --> ExistingMenu
    end

    M3_Select_Revised -- "Composes and Styles" --> Core_Existing_Components

    subgraph ConfiguredMenu_Internals_Reminder [Configured Menu Internals (Handled by src/Menu)]
        direction TB
        style ConfiguredMenu_Internals_Reminder fill:#eef,stroke:#333,stroke-dasharray: 5 5

        InternalMenuTrigger["(MenuTrigger - inside src/Menu)"]
        InternalPopover["(Popover - inside src/Menu)"]
        InternalRACMenu["(RACMenu - inside src/Menu)"]
        OptionalFilter_R["Optional Filter Input (part of Menu's items or custom logic)"]
        style OptionalFilter_R fill:#cff,stroke:#333
        MenuList_R["Menu List (with transitions)"]
        style MenuList_R fill:#ddf,stroke:#333

        ConfiguredMenu -. "Internally uses" .-> InternalMenuTrigger
        ConfiguredMenu -. "Internally uses" .-> InternalPopover
        ConfiguredMenu -. "Internally uses" .-> InternalRACMenu
        ConfiguredMenu --> OptionalFilter_R
        ConfiguredMenu --> MenuList_R
    end

    %% Transitions (Conceptual)
    ConfiguredTextField -- "Arrow Fade In/Out" --> DropdownArrow_R
    FloatingLabel_R -- "Scale & Move Up" --> ConfiguredTextField
    ConfiguredMenu -- "Fade In/Out & Slide (via Popover)" --> M3_Select_Revised