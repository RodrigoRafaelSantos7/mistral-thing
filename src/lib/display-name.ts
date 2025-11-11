export function getModelDisplayName(
  modelId: string,
  fallbackName?: string | null
): string {
  const modelNameMap: Record<string, string> = {
    "magistral-small-latest": "Magistral Small 1.2",
    "mistral-medium-latest": "Mistral Medium 3.1",
    "mistral-small-latest": "Mistral Small 3.2",
    "codestral-latest": "Codestral",
    "mistral-tiny-latest": "Mistral Nemo 12B",
    "ministral-3b-latest": "Ministral 3B",
    "ministral-8b-latest": "Ministral 8B",
  };

  return modelNameMap[modelId] ?? fallbackName ?? modelId;
}
