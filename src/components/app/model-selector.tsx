"use client";

import { ChevronsUpDown, Pin, PinOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ModelIcon from "@/components/app/model-icon";
import { Button } from "@/components/ui/button";
import { CapabilityBadges } from "@/components/ui/capability-badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useModel } from "@/lib/model-store/provider";
import type { ModelType } from "@/lib/model-store/utils";
import { useUserSettings } from "@/lib/user-settings-store/provider";
import { cn } from "@/lib/utils";

export function ModelSelector() {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [hoveredModel, setHoveredModel] = useState<ModelType | null>(null);
  const { models } = useModel();
  const { settings, updateSettings } = useUserSettings();
  const pinnedModelIds = settings.pinnedModels || [];

  const currentModel = settings.modelId
    ? models.find((m) => m.modelId === settings.modelId)
    : null;

  const pinnedModels = models.filter((model) =>
    pinnedModelIds.includes(model.modelId)
  );
  const otherModels = models.filter(
    (model) => !pinnedModelIds.includes(model.modelId)
  );

  useEffect(() => {
    if (!open) {
      setHoveredModel(null);
      setShowAll(false);
    }
  }, [open]);

  const handleSelectModel = (model: ModelType) => {
    setOpen(false);
    updateSettings({
      modelId: model.modelId,
    });
  };

  const handleTogglePin = (
    modelId: string,
    name: string | null,
    shouldPin: boolean
  ) => {
    const current = settings.pinnedModels || [];
    const activeModelCount = current.length;
    let updated: string[];
    if (shouldPin) {
      if (current.includes(modelId)) {
        toast.error("Model already pinned");
        return;
      }
      updated = [...current, modelId];
    } else {
      if (activeModelCount <= 1) {
        toast.error("You must have at least one pinned model");
        return;
      }
      updated = current.filter((id) => id !== modelId);
    }
    updateSettings({ pinnedModels: updated });
    toast.success(`${name || modelId} ${shouldPin ? "pinned" : "unpinned"}`);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button aria-expanded={open} variant="ghost">
          <div className="flex flex-1 items-center gap-2">
            {currentModel && (
              <ModelIcon
                className="fill-primary"
                modelId={currentModel.modelId}
              />
            )}
            <span className="hidden truncate md:block">
              {currentModel ? currentModel.name : null}
            </span>
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("relative min-w-[200px] p-0 sm:min-w-[400px]")}
      >
        <Command>
          <CommandInput className="h-9" placeholder="Find Model..." />
          <CommandList className={cn(showAll && "max-h-[500px]")}>
            <CommandEmpty>No model found.</CommandEmpty>
            {!showAll && (
              <CommandGroup>
                {pinnedModels.map((model) => (
                  <CommandItem
                    key={model.modelId}
                    onMouseEnter={() => setHoveredModel(model)}
                    onSelect={() => handleSelectModel(model)}
                    value={`${model.name} ${model.description ?? ""}`}
                  >
                    <span className="flex flex-1 items-center gap-2">
                      <ModelIcon
                        className="fill-primary"
                        modelId={model.modelId}
                      />
                      <span className="truncate">{model.name}</span>
                    </span>
                    <CapabilityBadges
                      capabilities={model.capabilities}
                      className="hidden sm:block"
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {showAll && (
              <>
                <CommandGroup heading="Pinned Models">
                  {pinnedModels.map((model) => (
                    <CommandItem
                      key={`pinned-${model.modelId}`}
                      onMouseEnter={() => setHoveredModel(model)}
                      onSelect={() => handleSelectModel(model)}
                      value={model.name}
                    >
                      <span className="flex flex-1 items-center gap-2">
                        <ModelIcon
                          className="fill-primary"
                          modelId={model.modelId}
                        />
                        <span className="truncate">{model.name}</span>
                      </span>
                      <CapabilityBadges
                        capabilities={model.capabilities}
                        className="hidden sm:block"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          aria-label="Unpin model"
                          className="size-5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePin(model.modelId, model.name, false);
                          }}
                          size="sm"
                          variant="ghost"
                        >
                          <PinOff className="size-3 opacity-70" />
                        </Button>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Other Models">
                  {otherModels.map((model) => (
                    <CommandItem
                      key={`other-${model.modelId}`}
                      onMouseEnter={() => setHoveredModel(model)}
                      onSelect={() => handleSelectModel(model)}
                      value={model.name}
                    >
                      <span className="flex flex-1 items-center gap-2">
                        <ModelIcon
                          className="fill-primary"
                          modelId={model.modelId}
                        />
                        <span className="truncate">{model.name}</span>
                      </span>
                      <CapabilityBadges
                        capabilities={model.capabilities}
                        className="hidden sm:block"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          aria-label="Pin model"
                          className="size-5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePin(model.modelId, model.name, true);
                          }}
                          size="sm"
                          variant="ghost"
                        >
                          <Pin className="size-3 opacity-70" />
                        </Button>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
          <CommandSeparator />
          <div className="flex items-center justify-between p-2">
            <Button
              className="w-full"
              onClick={() => setShowAll((prev) => !prev)}
              size="sm"
              variant="ghost"
            >
              {showAll ? "Show pinned only" : "Show all models"}
            </Button>
          </div>
        </Command>
        <div className="absolute top-0 right-0 hidden translate-x-full pl-2 md:block">
          {hoveredModel && (
            <div className="relative flex w-64 flex-col gap-4 overflow-hidden rounded-md border border-foreground/10 before:absolute before:inset-0 before:z-[-1] before:bg-sidebar/50 before:backdrop-blur-md">
              <div className="flex items-center gap-2 px-2 pt-2">
                <ModelIcon
                  className="size-4 fill-primary"
                  modelId={hoveredModel.modelId}
                />
                <span className="text-sm">{hoveredModel.name}</span>
              </div>
              <div className="flex items-center gap-2 px-2">
                <CapabilityBadges capabilities={hoveredModel.capabilities} />
              </div>
              <div className="px-2 pb-2 text-muted-foreground text-sm">
                {hoveredModel.description}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
