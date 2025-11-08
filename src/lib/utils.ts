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

// LCG (Linear Congruential Generator) constants
const LCG_MULTIPLIER = 1_664_525;
const LCG_INCREMENT = 1_013_904_223;
const LCG_MODULUS_BASE = 2;
const LCG_MODULUS_EXPONENT = 32;
const LCG_MODULUS = LCG_MODULUS_BASE ** LCG_MODULUS_EXPONENT;

export function seededRandom(seed: number): () => number {
  let state = seed;
  return (): number => {
    // Constants for the LCG (these values are commonly used)
    const a = LCG_MULTIPLIER; // Multiplier
    const c = LCG_INCREMENT; // Increment
    const m = LCG_MODULUS; // Modulus (2^32)
    state = (a * state + c) % m;
    return state / m; // Normalize to [0, 1)
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
