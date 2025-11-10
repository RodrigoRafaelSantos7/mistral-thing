export type Status = "ready" | "streaming" | "submitted";

export type Thread = {
  id: string;
  title?: string;
  status?: Status;
  streamId?: string;
  createdAt?: number;
  updatedAt?: number;
  userId: string;
};
