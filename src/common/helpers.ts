import crypto from "crypto";

/**
 * Sanitizes a string to prevent SQL injection.
 * @param {string} str - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
export function sanitizeString(str: string): string {
  return str.replace(/['";]/g, "");
}

/**
 * Generates a UUID.
 * @returns {string} - The generated UUID.
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}
