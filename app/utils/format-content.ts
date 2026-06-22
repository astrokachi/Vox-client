const OPTION_SEPARATOR = "---OPTION_SEPARATOR---";

export interface ParsedContent {
  parts: string[];
  isMulti: boolean;
}

export function formatContent(content: string, type?: string): ParsedContent {
  if (type === "MULTIPLE") {
    const parts = content
      .split(OPTION_SEPARATOR)
      .map((p) => p.trim())
      .filter(Boolean);
    return { parts, isMulti: true };
  }

  return { parts: [content], isMulti: false };
}
