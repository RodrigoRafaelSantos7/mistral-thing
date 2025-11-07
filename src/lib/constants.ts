import type { Limit } from "@/types/limits";

export const AnonymousLimits: Limit = {
  SEARCH: 5,
  RESEARCH: 0,
  CREDITS: 10,
};

export const FreeLimits: Limit = {
  SEARCH: 5,
  RESEARCH: 0,
  CREDITS: 20,
};

export const ProLimits: Limit = {
  SEARCH: 50,
  RESEARCH: 15,
  CREDITS: 200,
};
