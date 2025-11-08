import type { SVGProps } from "react";
import { Nemo } from "@/components/icons/nemo";
import { VoxtralIcon } from "@/components/icons/voxtral";
import type { ModelIcon } from "@/types/model-icons";
import { Codestral } from "../icons/codestral";
import { CodestralEmbed } from "../icons/codestral-embed";
import { Devstral } from "../icons/devstral";
import { Embed } from "../icons/embed";
import { Large } from "../icons/large";
import { Magistral } from "../icons/magistral";
import { Medium } from "../icons/medium";
import { Ministral } from "../icons/ministral";
import { OCR } from "../icons/ocr";
import { Pixtral } from "../icons/pixtral";
import { Small } from "../icons/small";

interface ModelIconProps extends SVGProps<SVGSVGElement> {
  icon: ModelIcon;
}

const ModelIconComponent = ({ icon, ...props }: ModelIconProps) => {
  const icons: Record<
    ModelIcon,
    React.ComponentType<SVGProps<SVGSVGElement>>
  > = {
    "codestral-embed": CodestralEmbed,
    codestral: Codestral,
    devstral: Devstral,
    embed: Embed,
    large: Large,
    magistral: Magistral,
    medium: Medium,
    ministral: Ministral,
    nemo: Nemo,
    ocr: OCR,
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
