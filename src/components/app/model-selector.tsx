"use client";

import { ChevronsUpDown, Pin, PinOff } from "lucide-react";
import { Activity, useEffect, useState } from "react";
import { toast } from "sonner";
import ModelIcon from "@/components/app/model-icon";
import { Button } from "@/components/ui/button";
import { CapabilityBadges } from "@/components/ui/capability-badges";
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
import { useModels, useSettings } from "@/hooks/use-database";
import { convertModelCapabilitiesToCapabilities } from "@/lib/capabilities";
import { getModelDisplayName } from "@/lib/display-name";
import { getModelIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Model } from "@/types/models";

export function ModelSelector() {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [hoveredModel, setHoveredModel] = useState<Model | null>(null);
  const allModels = useModels();
  const { settings, updateSettings } = useSettings();
  const pinnedModelIds = settings?.pinnedModels || [];

  const currentModel = settings?.modelId
    ? allModels?.find((m) => m.id === settings.modelId)
    : null;

  const models = allModels
    ? allModels.filter((model) => pinnedModelIds.includes(model.id))
    : [];
  const otherModels = allModels
    ? allModels.filter((model) => !pinnedModelIds.includes(model.id))
    : [];

  useEffect(() => {
    if (!open) {
      setHoveredModel(null);
      setShowAll(false);
    }
  }, [open]);

  const handleSelectModel = (model: Model) => {
    setOpen(false);
    updateSettings({
      modelId: model.id,
    });
  };

  const handleTogglePin = (modelId: string, shouldPin: boolean) => {
    if (!settings) {
      return;
    }
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
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button aria-expanded={open} variant="ghost">
          <div className="flex flex-1 items-center gap-2">
            <Activity mode={currentModel ? "visible" : "hidden"}>
              {currentModel &&
                (() => {
                  const icon = getModelIcon(currentModel.id);
                  return icon ? (
                    <ModelIcon className="fill-primary" icon={icon} />
                  ) : null;
                })()}
            </Activity>
            <span className="hidden truncate md:block">
              {currentModel
                ? getModelDisplayName(currentModel.id, currentModel.name)
                : null}
            </span>
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("relative min-w-[400px] p-0")}
      >
        <Command>
          <CommandInput className="h-9" placeholder="Find Model..." />
          <CommandList className={cn(showAll && "max-h-[500px]")}>
            <CommandEmpty>No model found.</CommandEmpty>
            <Activity mode={showAll ? "hidden" : "visible"}>
              <CommandGroup>
                {models?.map((model) => {
                  const icon = getModelIcon(model.id);
                  return (
                    <CommandItem
                      key={model.id}
                      onMouseEnter={() => setHoveredModel(model)}
                      onSelect={() => handleSelectModel(model)}
                      value={`${getModelDisplayName(model.id, model.name)} ${model.description ?? ""}`}
                    >
                      <span className="flex flex-1 items-center gap-2">
                        {icon && (
                          <ModelIcon className="fill-primary" icon={icon} />
                        )}
                        <span className="truncate">
                          {getModelDisplayName(model.id, model.name)}
                        </span>
                      </span>
                      <CapabilityBadges
                        capabilities={convertModelCapabilitiesToCapabilities(
                          model.capabilities,
                          model.id
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </Activity>

            <Activity mode={showAll ? "visible" : "hidden"}>
              <CommandGroup heading="Pinned Models">
                {models?.map((model) => {
                  const icon = getModelIcon(model.id);
                  const displayName = getModelDisplayName(model.id, model.name);
                  return (
                    <CommandItem
                      key={`pinned-${model.id}`}
                      onMouseEnter={() => setHoveredModel(model)}
                      onSelect={() => handleSelectModel(model)}
                      value={displayName}
                    >
                      <span className="flex flex-1 items-center gap-2">
                        {icon && (
                          <ModelIcon className="fill-primary" icon={icon} />
                        )}
                        <span className="truncate">{displayName}</span>
                      </span>
                      <CapabilityBadges
                        capabilities={convertModelCapabilitiesToCapabilities(
                          model.capabilities,
                          model.id
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          aria-label="Unpin model"
                          className="size-5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePin(model.id, false);
                          }}
                          size="sm"
                          variant="ghost"
                        >
                          <PinOff className="size-3 opacity-70" />
                        </Button>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Other Models">
                {otherModels?.map((model) => {
                  const icon = getModelIcon(model.id);
                  const displayName = getModelDisplayName(model.id, model.name);
                  return (
                    <CommandItem
                      key={`other-${model.id}`}
                      onMouseEnter={() => setHoveredModel(model)}
                      onSelect={() => handleSelectModel(model)}
                      value={displayName}
                    >
                      <span className="flex flex-1 items-center gap-2">
                        {icon && (
                          <ModelIcon className="fill-primary" icon={icon} />
                        )}
                        <span className="truncate">{displayName}</span>
                      </span>
                      <CapabilityBadges
                        capabilities={convertModelCapabilitiesToCapabilities(
                          model.capabilities,
                          model.id
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          aria-label="Pin model"
                          className="size-5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePin(model.id, true);
                          }}
                          size="sm"
                          variant="ghost"
                        >
                          <Pin className="size-3 opacity-70" />
                        </Button>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </Activity>
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
          <Activity mode={hoveredModel ? "visible" : "hidden"}>
            <div className="relative flex w-64 flex-col gap-4 overflow-hidden rounded-md border border-foreground/10 before:absolute before:inset-0 before:z-[-1] before:bg-sidebar/50 before:backdrop-blur-md">
              <div className="flex items-center gap-2 px-2 pt-2">
                {hoveredModel &&
                  (() => {
                    const icon = getModelIcon(hoveredModel.id);
                    return icon ? (
                      <ModelIcon className="size-4 fill-primary" icon={icon} />
                    ) : null;
                  })()}
                <span className="text-sm">
                  {hoveredModel
                    ? getModelDisplayName(hoveredModel.id, hoveredModel.name)
                    : null}
                </span>
              </div>
              <div className="flex items-center gap-2 px-2">
                <CapabilityBadges
                  capabilities={convertModelCapabilitiesToCapabilities(
                    hoveredModel?.capabilities,
                    hoveredModel?.id ?? ""
                  )}
                />
              </div>
              <div className="px-2 pb-2 text-muted-foreground text-sm">
                {hoveredModel?.description}
              </div>
            </div>
          </Activity>
        </div>
      </PopoverContent>
    </Popover>
  );
}
