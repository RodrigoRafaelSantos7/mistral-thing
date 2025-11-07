"use client";

import { useQuery } from "convex/react";
import { toast } from "sonner";
import ModelIcon from "@/components/app/model-icon";
import { Badge } from "@/components/ui/badge";
import { CapabilityBadges } from "@/components/ui/capability-badges";
import { Loading } from "@/components/ui/loading";
import { Section } from "@/components/ui/section";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import { useSettings } from "@/hooks/use-database";
import type { Model } from "@/types/models";

const Page = () => {
  const { settings, updateSettings } = useSettings();
  const allModels = useQuery(api.models.getAll);

  if (!settings) {
    return <Loading />;
  }

  const currentPinned = settings.pinnedModels || [];
  const activeModelCount = currentPinned.length;

  const handleModelToggle = (
    model: Model,
    name: string,
    isEnabled: boolean
  ) => {
    let updatedPinned: Model[] = [];

    if (isEnabled) {
      updatedPinned = [...currentPinned, model];
    } else {
      if (activeModelCount <= 1) {
        return;
      }
      updatedPinned = currentPinned.filter((m) => m !== model);
    }

    updateSettings({
      pinnedModels: updatedPinned,
    });

    toast.success(`${name} ${isEnabled ? "pinned" : "unpinned"}`);
  };

  const isPinned = (model: Model) => settings.pinnedModels.includes(model);

  return (
    <div className="flex w-full flex-col gap-8">
      <title>Models | Mistral Thing</title>
      <Section
        description="Toggle which models appear in your model selector"
        title="Available Models"
      >
        <div className="space-y-3">
          {allModels?.map((model) => (
            <div
              className="flex flex-col overflow-hidden rounded-lg border bg-card backdrop-blur-md"
              key={model._id}
            >
              <div className="flex flex-1 gap-4 border-b p-4">
                <div>
                  <ModelIcon
                    className="size-6 fill-primary"
                    icon={model.icon}
                  />
                </div>
                <div className="flex flex-1 gap-1">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{model.name}</span>
                      {model.access === "premium-required" && (
                        <Badge className="text-xs" variant="outline">
                          PRO
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {model.description}
                    </p>
                  </div>
                  <Switch
                    checked={isPinned(model.model)}
                    disabled={isPinned(model.model) && activeModelCount <= 1}
                    onCheckedChange={(checked) =>
                      handleModelToggle(model.model, model.name, checked)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 bg-sidebar p-4">
                <div>
                  {model.capabilities && model.capabilities.length > 0 && (
                    <div className="flex items-center gap-1">
                      <CapabilityBadges capabilities={model.capabilities} />
                    </div>
                  )}
                </div>

                <div className="text-muted-foreground text-xs">
                  {model.credits} credit
                  {Number(model.credits ?? 0) > 1 ? "s" : ""}/message
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Page;
