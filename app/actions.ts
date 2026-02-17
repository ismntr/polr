"use server";

import { prisma } from "@/lib/prisma";
import { generateRandomSlug, validateEnding } from "@/lib/utils";

const MAX_URL_LENGTH = 65_535;

export async function shortenUrl(formData: FormData) {
  const longUrl = (formData.get("url") as string | null)?.trim() ?? "";
  const customEnding = (
    formData.get("custom-ending") as string | null
  )?.trim();

  // ── Validate URL ──────────────────────────────────────────────
  if (!longUrl) {
    return { error: "Please enter a URL." };
  }

  try {
    new URL(longUrl);
  } catch {
    return { error: "Please enter a valid URL (include http:// or https://)." };
  }

  if (longUrl.length > MAX_URL_LENGTH) {
    return { error: "URL is too long." };
  }

  // ── Determine short slug ──────────────────────────────────────
  let slug: string;

  if (customEnding) {
    if (!validateEnding(customEnding)) {
      return {
        error:
          "Custom endings can only contain letters, numbers, hyphens, and underscores.",
      };
    }

    const existing = await prisma.link.findUnique({
      where: { shortUrl: customEnding },
    });

    if (existing) {
      return { error: "This custom ending is already in use." };
    }

    slug = customEnding;
  } else {
    // Generate a random slug, checking for collisions (max 10 attempts)
    const MAX_RETRIES = 10;
    let found = false;
    slug = "";

    for (let i = 0; i < MAX_RETRIES; i++) {
      slug = generateRandomSlug(6);
      const existing = await prisma.link.findUnique({
        where: { shortUrl: slug },
      });
      if (!existing) {
        found = true;
        break;
      }
    }

    if (!found) {
      return { error: "Unable to generate a unique slug. Please try again." };
    }
  }

  // ── Save to database ──────────────────────────────────────────
  await prisma.link.create({
    data: {
      shortUrl: slug,
      longUrl,
      isCustom: !!customEnding,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return { shortUrl: `${appUrl}/${slug}` };
}
