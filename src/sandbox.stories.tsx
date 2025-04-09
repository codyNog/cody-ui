import type { Meta, StoryObj } from "@storybook/react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Grid } from "./Grid";
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
      <Grid.Container>
        <h2>Contact Form Example</h2>
        <form onSubmit={handleSubmit}>
          <Grid.Row>
            <Grid.Column span={12}>
              <TextField
                label="Name"
                value={formState.name}
                onChangeText={(e) => setFormState({ ...formState, name: e })}
                required
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column span={12}>
              <TextField
                label="Email"
                type="email"
                value={formState.email}
                onChangeText={(e) => setFormState({ ...formState, email: e })}
                required
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column span={12}>
              <TextField
                label="Message"
                value={formState.message}
                onChangeText={(e) => setFormState({ ...formState, message: e })}
                multiline
                required
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column span={12}>
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
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column span={12}>
              <Switch
                checked={formState.subscribe}
                onChange={(checked) =>
                  setFormState({ ...formState, subscribe: checked })
                }
              >
                Subscribe to newsletter
              </Switch>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column span={12}>
              <Checkbox
                checked={formState.termsAccepted}
                onChangeChecked={(checked) =>
                  setFormState({ ...formState, termsAccepted: checked })
                }
                required
              >
                I accept the terms and conditions
              </Checkbox>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column span={12}>
              <div style={{ marginTop: "16px" }}>
                <Button type="submit">Submit</Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </form>
      </Grid.Container>
    );
  },
};
