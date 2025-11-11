import type { ModelCapabilities } from "@mistralai/mistralai/models/components";
import type { Capability } from "@/types/capabilities";

/**
 * Converts ModelCapabilities from Mistral SDK to Capability[] array
 */
export function convertModelCapabilitiesToCapabilities(
  capabilities: ModelCapabilities | undefined,
  modelId: string
): Capability[] {
  if (!capabilities) {
    return [];
  }

  const result: Capability[] = [];

  if (modelId?.includes("magistral")) {
    result.push("reasoning-output");
  }

  if (capabilities.completionChat || capabilities.completionFim) {
    result.push("text-input", "text-output");
  }

  if (capabilities.vision) {
    result.push("image-input");
  }

  return result;
}
