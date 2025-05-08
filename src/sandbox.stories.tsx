import type { Meta, StoryObj } from "@storybook/react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Grid, GridItem, GridRow } from "./Grid";
import { RadioGroup } from "./RadioGroup";
import { Switch } from "./Switch";
import { TextField } from "./TextField";

const meta = {
  title: "Sandbox",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormExample: Story = {
  render: () => {
    const [formState, setFormState] = useState({
      name: "",
      email: "",
      message: "",
      subscribe: false,
      contactPreference: "email",
      termsAccepted: false,
    });

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      alert(JSON.stringify(formState, null, 2));
    };

    return (
      <Grid>
        <GridItem colSpan={12}>
          <h2>Contact Form Example</h2>
        </GridItem>
        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          {/* formがGridレイアウトを壊さないように */}
          {/* 名前とメールアドレスを横に並べる */}
          <GridRow>
            <TextField
              label="Name"
              value={formState.name}
              onChangeText={(e) => setFormState({ ...formState, name: e })}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formState.email}
              onChangeText={(e) => setFormState({ ...formState, email: e })}
              required
            />
          </GridRow>
          <GridItem colSpan={12}>
            <TextField
              label="Message"
              value={formState.message}
              onChangeText={(e) => setFormState({ ...formState, message: e })}
              multiline
              required
            />
          </GridItem>
          <GridItem colSpan={12}>
            <RadioGroup
              label="Preferred contact method"
              value={formState.contactPreference}
              onChange={(value) =>
                setFormState({ ...formState, contactPreference: value })
              }
              options={[
                { value: "email", label: "Email" },
                { value: "phone", label: "Phone" },
                { value: "mail", label: "Mail" },
              ]}
            />
          </GridItem>
          {/* スイッチとチェックボックスを横に並べる */}
          <GridRow colSpan={12} spacing="var(--space-4)" align="center">
            <Switch
              checked={formState.subscribe}
              onChange={(checked) =>
                setFormState({ ...formState, subscribe: checked })
              }
            >
              Subscribe to newsletter
            </Switch>
            <Checkbox
              checked={formState.termsAccepted}
              onChangeChecked={(checked) =>
                setFormState({ ...formState, termsAccepted: checked })
              }
              label="I accept the terms and conditions"
              required
            />
          </GridRow>
          {/* 送信ボタンを右寄せ */}
          <GridItem colSpan={12}>
            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <Button type="submit">Submit</Button>
            </div>
          </GridItem>
        </form>
      </Grid>
    );
  },
};
