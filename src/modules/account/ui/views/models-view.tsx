"use client";

import { toast } from "sonner";
import ModelIcon from "@/components/app/model-icon";
import { CapabilityBadges } from "@/components/ui/capability-badges";
import { Section } from "@/components/ui/section";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useModels, useSettings } from "@/hooks/use-database";
import { convertModelCapabilitiesToCapabilities } from "@/lib/capabilities";
import { getModelDisplayName } from "@/lib/display-name";
import { getModelIcon } from "@/lib/icons";

const ModelsView = () => {
  const { settings, updateSettings } = useSettings();
  const allModels = useModels();

  if (!settings) {
    return <Spinner />;
  }

  if (!allModels) {
    return <Spinner />;
  }

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
          {allModels?.map((model) => {
            const icon = getModelIcon(model.id);
            const capabilities = convertModelCapabilitiesToCapabilities(
              model.capabilities,
              model.id
            );
            return (
              <div
                className="flex flex-col overflow-hidden rounded-lg border bg-card backdrop-blur-md"
                key={model.id}
              >
                <div className="flex flex-1 gap-4 border-b p-4">
                  <div>
                    {icon && (
                      <ModelIcon className="size-6 fill-primary" icon={icon} />
                    )}
                  </div>
                  <div className="flex flex-1 gap-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {getModelDisplayName(model.id, model.name)}
                        </span>
                      </div>
                      {model.description && (
                        <p className="text-muted-foreground text-sm">
                          {model.description}
                        </p>
                      )}
                    </div>
                    <Switch
                      checked={isPinned(model.id)}
                      className="ml-auto"
                      disabled={isPinned(model.id) && activeModelCount <= 1}
                      onCheckedChange={(checked) =>
                        handleModelToggle(
                          model.id,
                          getModelDisplayName(model.id, model.name),
                          checked
                        )
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 bg-sidebar p-4">
                  <div>
                    {capabilities && capabilities.length > 0 && (
                      <div className="flex items-center gap-1">
                        <CapabilityBadges capabilities={capabilities} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
};

export { ModelsView };
