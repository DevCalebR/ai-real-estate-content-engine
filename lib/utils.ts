import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Platform } from "@/lib/types/content";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoDate: string, withYear = true) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
  }).format(new Date(isoDate));
}

export function formatDateTime(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function summarizePlatforms(platforms: Platform[]) {
  return platforms.join(" • ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function buildDownloadBaseName(businessName: string, createdAt: string) {
  const date = new Date(createdAt).toISOString().slice(0, 10);
  return `${slugify(businessName) || "content-plan"}-${date}`;
}

export function extractJsonObject(payload: string) {
  const trimmed = payload.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const withoutFences = trimmed.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

  if (withoutFences.startsWith("{") && withoutFences.endsWith("}")) {
    return withoutFences;
  }

  const firstBrace = withoutFences.indexOf("{");
  const lastBrace = withoutFences.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("The AI response did not contain a valid JSON object.");
  }

  return withoutFences.slice(firstBrace, lastBrace + 1);
}

export function clampText(text: string, maxLength: number) {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1)}…`;
}
