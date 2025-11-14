export type ModelType = {
  modelId: string;
  name: string;
  description: string;
  capabilities: {
    completionChat?: boolean | undefined;
    completionFim?: boolean | undefined;
    functionCalling?: boolean | undefined;
    fineTuning?: boolean | undefined;
    vision?: boolean | undefined;
    classification?: boolean | undefined;
  };
};

export type ModelContextType = {
  models: ModelType[];
};
