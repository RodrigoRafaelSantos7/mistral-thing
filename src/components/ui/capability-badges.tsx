import type { ReactNode } from "react";
import { Arrow } from "@/components/icons/arrow";
import { Image } from "@/components/icons/image";
import { Reasoning } from "@/components/icons/reasoning";
import { TextIcon } from "@/components/icons/text";
import { Voice } from "@/components/icons/voice";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Capability } from "@/types/capabilities";

type CapabilityIconProps = {
  capability: Capability;
  children: ReactNode;
};

function CapabilityIcon({ capability, children }: CapabilityIconProps) {
  const label = capability
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function getCapabilityIcon(capability: Capability) {
  const baseType = capability.split("-")[0];

  switch (baseType) {
    case "reasoning":
      return <Reasoning />;
    case "text":
      return <TextIcon />;
    case "image":
      return <Image />;
    case "voice":
      return <Voice />;
    default:
      return <TextIcon />;
  }
}

export type CapabilityBadgesProps = {
  capabilities?: Capability[];
  className?: string;
};

export function CapabilityBadges({
  capabilities,
  className,
}: CapabilityBadgesProps) {
  if (!capabilities || capabilities.length === 0) {
    return null;
  }

  const inputs = capabilities.filter((cap) => cap.endsWith("-input"));
  const outputs = capabilities.filter((cap) => cap.endsWith("-output"));

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="z-1 flex items-center gap-1 rounded-lg p-1 font-medium text-[10px] text-primary">
        {inputs.map((input) => (
          <CapabilityIcon capability={input} key={input}>
            <span className="flex items-center">
              {getCapabilityIcon(input)}
            </span>
          </CapabilityIcon>
        ))}

        <span className="flex items-center">
          <Arrow />
        </span>

        {outputs.map((output) => (
          <CapabilityIcon capability={output} key={output}>
            <span className="flex items-center">
              {getCapabilityIcon(output)}
            </span>
          </CapabilityIcon>
        ))}
      </div>
    </div>
  );
}
