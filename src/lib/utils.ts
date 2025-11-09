import { type ClassValue, clsx } from "clsx";
import { marked } from "marked";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";
import { env } from "./env";

const NANOID_LENGTH = 21;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUrl = () =>
  env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://mistral-thing.xyz";

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  NANOID_LENGTH
);

const LCG_MULTIPLIER = 1_664_525;
const LCG_INCREMENT = 1_013_904_223;
const LCG_MODULUS_BASE = 2;
const LCG_MODULUS_EXPONENT = 32;
const LCG_MODULUS = LCG_MODULUS_BASE ** LCG_MODULUS_EXPONENT;

export function seededRandom(seed: number): () => number {
  let state = seed;
  return (): number => {
    const a = LCG_MULTIPLIER;
    const c = LCG_INCREMENT;
    const m = LCG_MODULUS;
    state = (a * state + c) % m;
    return state / m;
  };
}

export const lexer = (() => {
  let lastText = "";
  let lastResult: string[] = [];
  return (markdown: string): string[] => {
    if (markdown === lastText) {
      return lastResult;
    }
    lastText = markdown;
    const tokens = marked.lexer(markdown);
    lastResult = tokens.map((token) => token.raw);
    return lastResult;
  };
})();
