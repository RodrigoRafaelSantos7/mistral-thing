import type { ModelCapabilities } from "@mistralai/mistralai/models/components";

export type Model = {
  id: string;
  name?: string | null;
  description?: string | null;
  capabilities: ModelCapabilities;
};
