import type { ModelIcon as ModelIconType } from "@/types/model-icons";

export function getModelIcon(modelId: string): ModelIconType | null {
  if (modelId.includes("codestral-embed")) {
    return "codestral-embed";
  }
  if (modelId.includes("codestral")) {
    return "codestral";
  }
  if (modelId.includes("pixtral")) {
    return "pixtral";
  }
  if (modelId.includes("voxtral")) {
    return "voxtral";
  }
  if (modelId.includes("devstral")) {
    return "devstral";
  }
  if (modelId.includes("ministral")) {
    return "ministral";
  }
  if (modelId.includes("tiny")) {
    return "nemo";
  }
  if (modelId.includes("magistral")) {
    return "magistral";
  }
  if (modelId.includes("large")) {
    return "large";
  }
  if (modelId.includes("medium")) {
    return "medium";
  }
  if (modelId.includes("small")) {
    return "small";
  }
  if (modelId.includes("embed")) {
    return "embed";
  }
  return null;
}
