/**
 * Base62 encoding/decoding utilities.
 * Ported from app/Helpers/BaseHelper.php
 */

const BASE62_CHARS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Convert a base-10 number to a base-N string (default base 62). */
export function toBase(num: number, b = 62): string {
  if (num === 0) return BASE62_CHARS[0];

  let res = "";
  let q = num;

  while (q > 0) {
    const r = q % b;
    res = BASE62_CHARS[r] + res;
    q = Math.floor(q / b);
  }

  return res;
}

/** Convert a base-N string back to base-10 (default base 62). */
export function toBase10(str: string, b = 62): number {
  let res = BASE62_CHARS.indexOf(str[0]);

  for (let i = 1; i < str.length; i++) {
    res = b * res + BASE62_CHARS.indexOf(str[i]);
  }

  return res;
}

/** Generate a cryptographically random alphanumeric string. */
export function generateRandomSlug(length = 6): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join("");
}

/** Validate that a custom ending contains only alphanumeric, hyphens, underscores. */
export function validateEnding(ending: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(ending);
}
