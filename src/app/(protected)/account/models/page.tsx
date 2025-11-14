"use client";

import { toast } from "sonner";
import { CapabilityBadges } from "@/components/capability-badge";
import ModelIconComponent from "@/components/model-icon";
import { Section } from "@/components/ui/section";
import { Switch } from "@/components/ui/switch";
import { useModels } from "@/lib/models-store/provider";
import { useUserSettings } from "@/lib/user-settings-store/provider";

const Page = () => {
  const { settings, updateSettings } = useUserSettings();
  const { models } = useModels();

  const currentPinned = settings.pinnedModels || [];
  const activeModelCount = currentPinned.length;

  const handleModelToggle = (
    modelId: string,
    name: string | null,
    isEnabled: boolean
  ) => {
    let updatedPinned: string[] = [];

    if (isEnabled) {
      if (currentPinned.includes(modelId)) {
        return;
      }
      updatedPinned = [...currentPinned, modelId];
    } else {
      if (activeModelCount <= 1) {
        toast.error("You must have at least one pinned model");
        return;
      }
      updatedPinned = currentPinned.filter((id: string) => id !== modelId);
    }

    updateSettings({
      pinnedModels: updatedPinned,
    });

    toast.success(`${name || modelId} ${isEnabled ? "pinned" : "unpinned"}`);
  };

  const isPinned = (modelId: string) => currentPinned.includes(modelId);

  return (
    <div className="flex w-full flex-col gap-8">
      <Section
        description="Toggle which models appear in your model selector"
        title="Available Models"
      >
        <div className="space-y-3">
          {models.map((model) => (
            <div
              className="flex flex-col overflow-hidden rounded-lg border bg-card backdrop-blur-md"
              key={model.modelId}
            >
              <div className="flex flex-1 gap-4 border-b p-4">
                <ModelIconComponent
                  className="size-12 fill-primary"
                  modelId={model.modelId}
                />
                <div className="flex flex-1 gap-1">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{model.name}</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {model.description}
                    </p>
                  </div>
                  <Switch
                    checked={isPinned(model.modelId)}
                    className="ml-auto"
                    disabled={isPinned(model.modelId) && activeModelCount <= 1}
                    onCheckedChange={(checked) =>
                      handleModelToggle(model.modelId, model.name, checked)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 bg-sidebar p-4">
                <CapabilityBadges capabilities={model.capabilities} />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Page;
