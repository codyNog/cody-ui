import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps, FormEvent } from "react";
import { useState } from "react";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Grid, GridItem, GridRow } from "./Grid";
import { MdHouse, MdNotifications, MdSettings } from "./Icons"; // Import MD Icons
import { Navigation } from "./Navigation"; // Add Navigation import
import { RadioGroup } from "./RadioGroup";
import { Switch } from "./Switch";
import { TextField } from "./TextField";

const meta = {
  title: "playground/Sandbox",
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sandbox: Story = {
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

    const navigations: ComponentProps<typeof Navigation>["navigations"] = [
      {
        id: "home",
        item: {
          id: "home",
          label: "Home",
          icon: <MdHouse size={24} />,
        },
        sections: [
          {
            id: "home-section",
            // headline: "Home Section", // headline is not a direct prop of sections in NavigationDrawer
            items: [
              { id: "home-1", type: "link", label: "Dashboard", href: "#" },
              { id: "home-2", type: "link", label: "Analytics", href: "#" },
            ],
          },
        ],
      },
      {
        id: "settings",
        item: {
          id: "settings",
          label: "Settings",
          icon: <MdSettings size={24} />,
        },
        sections: [
          {
            id: "settings-section",
            // headline: "Settings Section",
            items: [
              { id: "settings-1", type: "link", label: "Profile", href: "#" },
              { id: "settings-2", type: "link", label: "Account", href: "#" },
            ],
          },
        ],
      },
      {
        id: "notifications",
        item: {
          id: "notifications",
          label: "Notifications",
          icon: <MdNotifications size={24} />,
          badge: 3,
        },
        sections: [
          {
            id: "notifications-section",
            // headline: "Notifications Section",
            items: [
              {
                id: "notifications-1",
                type: "link",
                label: "Inbox",
                href: "#",
              },
              {
                id: "notifications-2",
                type: "link",
                label: "Archive",
                href: "#",
              },
            ],
          },
        ],
      },
    ];

    return (
      <div style={{ display: "flex", height: "100vh" }}>
        <Navigation navigations={navigations} />
        <div style={{ flex: 1 }}>
          <Grid>
            <GridItem colSpan={12}>
              <h2>Contact Form Example</h2>
            </GridItem>
            <form onSubmit={handleSubmit} style={{ display: "contents" }}>
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
                  onChangeText={(e) =>
                    setFormState({ ...formState, message: e })
                  }
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
              <GridItem colSpan={12}>
                <div style={{ marginTop: "16px", textAlign: "right" }}>
                  <Button type="submit">Submit</Button>
                </div>
              </GridItem>
            </form>
          </Grid>
        </div>
      </div>
    );
  },
};
