import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { BentoGrid, BentoGridItem, Grid, GridItem, GridRow } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Grid> = {
  component: Grid,
};

export default meta;

type Story = StoryObj<typeof Grid>;

// サンプルコンテンツを生成する関数
const createSampleContent = (title: string, description: string) => (
  <div
    style={{
      height: "100%",
      backgroundColor: "var(--md-sys-color-surface-container)",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <h3 style={{ margin: 0, marginBottom: "8px" }}>{title}</h3>
    <p style={{ margin: 0 }}>{description}</p>
  </div>
);

// サンプルフォーム要素を生成する関数
const createFormElement = (label: string) => (
  <div
    style={{
      backgroundColor: "var(--md-sys-color-surface-container-low)",
      borderRadius: "8px",
    }}
  >
    <div style={{ marginBottom: "4px" }}>{label}</div>
    <div
      style={{
        height: "32px",
        backgroundColor: "var(--md-sys-color-surface-container-high)",
        borderRadius: "4px",
      }}
    />
  </div>
);

export const Default: Story = {
  args: {},
  render: () => (
    <Grid>
      <GridItem colSpan={6}>
        {createSampleContent(
          "メインコンテンツ",
          "colSpan: 6, rowSpan: 1 - 横幅半分のアイテム",
        )}
      </GridItem>
      <GridItem colSpan={6}>
        {createSampleContent(
          "メインコンテンツ",
          "colSpan: 6, rowSpan: 1 - 横幅半分のアイテム",
        )}
      </GridItem>
      <GridItem colSpan={4}>
        {createSampleContent(
          "サブコンテンツ",
          "colSpan: 4, rowSpan: 1 - 3分の1幅のアイテム",
        )}
      </GridItem>
      <GridItem colSpan={4}>
        {createSampleContent(
          "サブコンテンツ",
          "colSpan: 4, rowSpan: 1 - 3分の1幅のアイテム",
        )}
      </GridItem>
      <GridItem colSpan={4}>
        {createSampleContent(
          "サブコンテンツ",
          "colSpan: 4, rowSpan: 1 - 3分の1幅のアイテム",
        )}
      </GridItem>
      <GridItem colSpan={12}>
        {createSampleContent(
          "フルワイドコンテンツ",
          "colSpan: 12, rowSpan: 1 - 横幅いっぱいのアイテム",
        )}
      </GridItem>
    </Grid>
  ),
};

export const VariedLayout: Story = {
  args: {},
  render: () => (
    <Grid>
      <GridItem colSpan={8}>
        {createSampleContent(
          "特集コンテンツ",
          "colSpan: 8, rowSpan: 1 - 大きめのアイテム",
        )}
      </GridItem>
      <GridItem colSpan={4} rowSpan={2}>
        {createSampleContent(
          "サイドバー",
          "colSpan: 4, rowSpan: 2 - 縦長のアイテム",
        )}
      </GridItem>
      <GridItem colSpan={4}>
        {createSampleContent("小さいコンテンツ", "colSpan: 4, rowSpan: 1")}
      </GridItem>
      <GridItem colSpan={4}>
        {createSampleContent("小さいコンテンツ", "colSpan: 4, rowSpan: 1")}
      </GridItem>
    </Grid>
  ),
};

export const WithGridRow: Story = {
  args: {},
  render: () => (
    <Grid>
      <GridItem colSpan={12}>
        {createSampleContent(
          "フォームタイトル",
          "GridRowを使用して横並びのフォーム要素を配置",
        )}
      </GridItem>

      {/* 横並びの入力フィールド */}
      <GridRow spacing="var(--space-4)">
        {createFormElement("姓")}
        {createFormElement("名")}
      </GridRow>

      <GridItem colSpan={12}>{createFormElement("メールアドレス")}</GridItem>

      {/* 横並びの日付選択 */}
      <GridRow>
        {createFormElement("開始日")}
        {createFormElement("終了日")}
      </GridRow>

      <GridItem colSpan={12}>{createFormElement("備考")}</GridItem>

      {/* 右寄せのボタン */}
      <GridRow justify="end" spacing="var(--space-2)">
        <button
          type="button"
          style={{
            backgroundColor: "var(--md-sys-color-surface-container)",
            borderRadius: "4px",
            border: "1px solid var(--md-sys-color-outline)",
          }}
        >
          キャンセル
        </button>
        <button
          type="button"
          style={{
            backgroundColor: "var(--md-sys-color-primary)",
            color: "var(--md-sys-color-on-primary)",
            borderRadius: "4px",
            border: "none",
          }}
        >
          送信
        </button>
      </GridRow>
    </Grid>
  ),
};

export const ResponsiveDefault: Story = {
  args: {},
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h3>デフォルトバリアント - レスポンシブ対応</h3>
        <p>
          小さいコンテナ（599px以下）: 4カラム
          <br />
          中くらいのコンテナ（600px〜904px）: 8カラム
          <br />
          大きいコンテナ（905px以上）: 12カラム
        </p>
      </div>
      
      <div style={{ width: "500px", border: "1px dashed gray", padding: "16px" }}>
        <h4>500px幅のコンテナ（4カラム）</h4>
        <Grid>
          <GridItem colSpan={2}>
            {createSampleContent("アイテム1", "colSpan: 2")}
          </GridItem>
          <GridItem colSpan={2}>
            {createSampleContent("アイテム2", "colSpan: 2")}
          </GridItem>
          <GridItem colSpan={4}>
            {createSampleContent("アイテム3", "colSpan: 4 (フル幅)")}
          </GridItem>
        </Grid>
      </div>

      <div style={{ width: "750px", border: "1px dashed gray", padding: "16px" }}>
        <h4>750px幅のコンテナ（8カラム）</h4>
        <Grid>
          <GridItem colSpan={4}>
            {createSampleContent("アイテム1", "colSpan: 4")}
          </GridItem>
          <GridItem colSpan={4}>
            {createSampleContent("アイテム2", "colSpan: 4")}
          </GridItem>
          <GridItem colSpan={8}>
            {createSampleContent("アイテム3", "colSpan: 8 (フル幅)")}
          </GridItem>
        </Grid>
      </div>

      <div style={{ width: "1000px", border: "1px dashed gray", padding: "16px" }}>
        <h4>1000px幅のコンテナ（12カラム）</h4>
        <Grid>
          <GridItem colSpan={4}>
            {createSampleContent("アイテム1", "colSpan: 4")}
          </GridItem>
          <GridItem colSpan={4}>
            {createSampleContent("アイテム2", "colSpan: 4")}
          </GridItem>
          <GridItem colSpan={4}>
            {createSampleContent("アイテム3", "colSpan: 4")}
          </GridItem>
          <GridItem colSpan={12}>
            {createSampleContent("アイテム4", "colSpan: 12 (フル幅)")}
          </GridItem>
        </Grid>
      </div>
    </div>
  ),
};

export const BentoVariant: Story = {
  args: {},
  render: () => (
    <Grid variant="bento">
      <GridItem colSpan={6}>
        {createSampleContent(
          "Bentoバリアント",
          "variant: bento - 背景色、影、角丸などのスタイルが適用されます",
        )}
      </GridItem>
      <GridItem colSpan={6}>
        {createSampleContent(
          "Bentoバリアント",
          "variant: bento - 背景色、影、角丸などのスタイルが適用されます",
        )}
      </GridItem>
      <GridItem colSpan={4}>
        {createSampleContent(
          "Bentoバリアント",
          "variant: bento - コンテナクエリによるレスポンシブ対応",
        )}
      </GridItem>
      <GridItem colSpan={4}>
        {createSampleContent(
          "Bentoバリアント",
          "variant: bento - コンテナクエリによるレスポンシブ対応",
        )}
      </GridItem>
      <GridItem colSpan={4}>
        {createSampleContent(
          "Bentoバリアント",
          "variant: bento - コンテナクエリによるレスポンシブ対応",
        )}
      </GridItem>
    </Grid>
  ),
};

export const VariantComparison: Story = {
  args: {},
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <div>
        <h3>デフォルトバリアント</h3>
        <Grid>
          <GridItem colSpan={4}>
            {createSampleContent("デフォルト", "variant: default")}
          </GridItem>
          <GridItem colSpan={4}>
            {createSampleContent("デフォルト", "variant: default")}
          </GridItem>
          <GridItem colSpan={4}>
            {createSampleContent("デフォルト", "variant: default")}
          </GridItem>
        </Grid>
      </div>

      <div>
        <h3>Bentoバリアント</h3>
        <Grid variant="bento">
          <GridItem colSpan={4}>
            {createSampleContent("Bento", "variant: bento")}
          </GridItem>
          <GridItem colSpan={4}>
            {createSampleContent("Bento", "variant: bento")}
          </GridItem>
          <GridItem colSpan={4}>
            {createSampleContent("Bento", "variant: bento")}
          </GridItem>
        </Grid>
      </div>

      <div>
        <h3>後方互換性のあるBentoGrid</h3>
        <BentoGrid>
          <BentoGridItem colSpan={4}>
            {createSampleContent("BentoGrid", "BentoGridItemを使用")}
          </BentoGridItem>
          <BentoGridItem colSpan={4}>
            {createSampleContent("BentoGrid", "BentoGridItemを使用")}
          </BentoGridItem>
          <BentoGridItem colSpan={4}>
            {createSampleContent("BentoGrid", "BentoGridItemを使用")}
          </BentoGridItem>
        </BentoGrid>
      </div>
    </div>
  ),
};

export const ResponsiveWithContainer: Story = {
  args: {},
  render: () => (
    <div
      style={{
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <div>
        <h3>
          ブラウザの幅を変更すると、コンテナクエリによってレイアウトが変わります
        </h3>
        <p>
          小さいコンテナ（400px以下）: 1カラム
          <br />
          中くらいのコンテナ（401px〜700px）: 6カラム
          <br />
          大きいコンテナ（701px以上）: 12カラム
        </p>
      </div>

      <div
        style={{ width: "350px", border: "1px dashed gray", padding: "16px" }}
      >
        <h4>350px幅のコンテナ</h4>
        <Grid variant="bento">
          <GridItem colSpan={4}>
            {createSampleContent("アイテム1", "1カラムに")}
          </GridItem>
          <GridItem colSpan={4}>
            {createSampleContent("アイテム2", "1カラムに")}
          </GridItem>
          <GridItem colSpan={4}>
            {createSampleContent("アイテム3", "1カラムに")}
          </GridItem>
        </Grid>
      </div>

      <div
        style={{ width: "550px", border: "1px dashed gray", padding: "16px" }}
      >
        <h4>550px幅のコンテナ</h4>
        <Grid variant="bento">
          <GridItem colSpan={4}>
            {createSampleContent("アイテム1", "2カラムに")}
          </GridItem>
          <GridItem colSpan={4}>
            {createSampleContent("アイテム2", "2カラムに")}
          </GridItem>
          <GridItem colSpan={4}>
            {createSampleContent("アイテム3", "2カラムに")}
          </GridItem>
        </Grid>
      </div>

      <div
        style={{ width: "800px", border: "1px dashed gray", padding: "16px" }}
      >
        <h4>800px幅のコンテナ</h4>
        <Grid variant="bento">
          <GridItem colSpan={4}>
            {createSampleContent("アイテム1", "4カラムに")}
          </GridItem>
          <GridItem colSpan={4}>
            {createSampleContent("アイテム2", "4カラムに")}
          </GridItem>
          <GridItem colSpan={4}>
            {createSampleContent("アイテム3", "4カラムに")}
          </GridItem>
        </Grid>
      </div>
    </div>
  ),
};

export const Behavior: Story = {
  args: {},
  render: () => (
    <Grid>
      <GridItem colSpan={6}>
        {createSampleContent("テストアイテム", "動作確認用")}
      </GridItem>
      <GridItem colSpan={6}>
        {createSampleContent("テストアイテム", "動作確認用")}
      </GridItem>
    </Grid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};
