export function getModelDisplayName(
  modelId: string,
  fallbackName?: string | null
): string {
  const modelNameMap: Record<string, string> = {
    "magistral-small-latest": "Magistral Small 1.2",
    "mistral-small-latest": "Mistral Small 3.2",
    "devstral-small-latest": "Devstral Small 1.1",
    "open-mistral-nemo": "Mistral Nemo 12B",
  };

  return modelNameMap[modelId] ?? fallbackName ?? modelId;
}
