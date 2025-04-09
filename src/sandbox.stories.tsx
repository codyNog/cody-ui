import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
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

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(JSON.stringify(formState, null, 2));
    };

    return (
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h2>Contact Form Example</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <TextField
            label="Name"
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
            required
          />

          <TextField
            label="Email"
            type="email"
            value={formState.email}
            onChange={(e) =>
              setFormState({ ...formState, email: e.target.value })
            }
            required
          />

          <TextField
            label="Message"
            value={formState.message}
            onChange={(e) =>
              setFormState({ ...formState, message: e.target.value })
            }
            multiline
            rows={4}
            required
          />

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

          <Switch
            label="Subscribe to newsletter"
            checked={formState.subscribe}
            onChange={(checked) =>
              setFormState({ ...formState, subscribe: checked })
            }
          />

          <Checkbox
            label="I accept the terms and conditions"
            checked={formState.termsAccepted}
            onChange={(checked) =>
              setFormState({ ...formState, termsAccepted: checked })
            }
            required
          />

          <div style={{ marginTop: "16px" }}>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    );
  },
};
