/**
 * Decodes various types of encoded strings:
 * - HTML entities (like &amp;, &quot;, &copy;)
 * - URL encoded characters (%20, %26)
 * - Unicode escapes (\u00A9)
 */
export function decodeString(encodedString: string): string {
  if (!encodedString) return "";

  // Create a temporary element to decode HTML entities
  const decodeHtmlEntities = (str: string): string => {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent || "";
  };

  // Step 1: Decode URL encoded characters
  let decoded = decodeURIComponent(encodedString);

  // Step 2: Decode HTML entities
  try {
    // This works in browser environments
    decoded = decodeHtmlEntities(decoded);
  } catch (e) {
    // Fallback for server-side or if DOMParser is not available
    decoded = decoded
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#x2F;/g, "/")
      .replace(/&#x27;/g, "'")
      .replace(/&#x60;/g, "`")
      .replace(/&copy;/g, "©")
      .replace(/&reg;/g, "®")
      .replace(/&trade;/g, "™");
  }

  // Step 3: Decode Unicode escapes
  decoded = decoded.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(Number.parseInt(hex, 16))
  );

  return decoded;
}
