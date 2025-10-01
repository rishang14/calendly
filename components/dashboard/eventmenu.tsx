"use client";

import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateEventAction } from "@/action/serveraction";

export function MenuActiveSwitch({
  initalChecked,
  eventTypeId,
}: {
  initalChecked: boolean;
  eventTypeId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [checked, setChecked] = useState(initalChecked);

  return (
    <Switch
      checked={checked}
      disabled={isPending}
      onCheckedChange={(isChecked) => {
        setChecked(isChecked);
        startTransition(async () => {
          try {
            const { success, error } = await updateEventAction(
              { active: isChecked },
              eventTypeId
            );

            if (error) {
              setChecked(!isChecked);
              toast.error("Server error", {
                duration: 3000,
                description: error,
              });
              return;
            }

            if (success) {
              toast.success("Event Type updated", {
                description: "Event type is changed",
                duration: 3000,
              });
            }
          } catch {
            setChecked(!isChecked);
            toast.error("Something went wrong");
          }
        });
      }}
    />
  );
}
