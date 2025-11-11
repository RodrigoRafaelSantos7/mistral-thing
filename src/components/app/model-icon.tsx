import type { SVGProps } from "react";
import { Codestral } from "@/components/icons/codestral";
import { CodestralEmbed } from "@/components/icons/codestral-embed";
import { Devstral } from "@/components/icons/devstral";
import { Embed } from "@/components/icons/embed";
import { Large } from "@/components/icons/large";
import { Magistral } from "@/components/icons/magistral";
import { Medium } from "@/components/icons/medium";
import { Ministral } from "@/components/icons/ministral";
import { Nemo } from "@/components/icons/nemo";
import { Pixtral } from "@/components/icons/pixtral";
import { Small } from "@/components/icons/small";
import { VoxtralIcon } from "@/components/icons/voxtral";
import type { ModelIcon } from "@/types/model-icons";

interface ModelIconProps extends SVGProps<SVGSVGElement> {
  icon: ModelIcon;
}

const ModelIconComponent = ({ icon, ...props }: ModelIconProps) => {
  const icons: Record<
    ModelIcon,
    React.ComponentType<SVGProps<SVGSVGElement>>
  > = {
    codestral: Codestral,
    "codestral-embed": CodestralEmbed,
    devstral: Devstral,
    embed: Embed,
    large: Large,
    magistral: Magistral,
    medium: Medium,
    ministral: Ministral,
    nemo: Nemo,
    pixtral: Pixtral,
    small: Small,
    voxtral: VoxtralIcon,
  };

  const Icon = icons[icon];

  if (!Icon) {
    return null;
  }

  return <Icon {...props} />;
};

export default ModelIconComponent;
