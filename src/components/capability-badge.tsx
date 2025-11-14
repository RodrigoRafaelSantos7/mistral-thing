import { Arrow } from "@/components/icons/arrow";
import { Image } from "@/components/icons/image";
import { Reasoning } from "@/components/icons/reasoning";
import { TextIcon } from "@/components/icons/text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ModelType } from "@/lib/models-store/provider";
import { cn } from "@/lib/utils";

const mapCapabilities = (
  capabilities: ModelType["capabilities"]
): { inputs: string[]; outputs: string[] } => {
  const inputs: string[] = [];
  const outputs: string[] = [];

  if (capabilities.vision) {
    inputs.push("image-input");
  }
  if (capabilities.completionChat) {
    inputs.push("text-input");
    outputs.push("text-output");
  }
  if (capabilities.fineTuning) {
    outputs.push("reasoning-output");
  }

  return { inputs, outputs };
};

const getCapabilityIcon = (capability: string) => {
  if (capability.includes("text")) {
    return <TextIcon />;
  }
  if (capability.includes("image")) {
    return <Image />;
  }
  if (capability.includes("reasoning")) {
    return <Reasoning />;
  }
  return null;
};

type CapabilityIconProps = {
  capability: string;
  children: React.ReactNode;
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

export type CapabilityBadgesProps = {
  capabilities: ModelType["capabilities"];
  className?: string;
};

export function CapabilityBadges({
  capabilities,
  className,
}: CapabilityBadgesProps) {
  const { inputs, outputs } = mapCapabilities(capabilities);

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
