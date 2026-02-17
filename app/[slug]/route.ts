import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const link = await prisma.link.findUnique({
    where: { shortUrl: slug },
  });

  if (!link || link.isDisabled) {
    return NextResponse.redirect(new URL("/404", request.url));
  }

  // ── Record click (fire-and-forget) ──────────────────────────
  const headersList = headers();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
  const userAgent = headersList.get("user-agent") ?? null;
  const referer = headersList.get("referer") ?? null;
  let refererHost: string | null = null;

  if (referer) {
    try {
      refererHost = new URL(referer).hostname;
    } catch {
      // invalid referer, leave null
    }
  }

  // Fire and forget: increment clicks and record click event
  prisma
    .$transaction([
      prisma.link.update({
        where: { id: link.id },
        data: { clicks: { increment: 1 } },
      }),
      prisma.click.create({
        data: {
          linkId: link.id,
          ip,
          userAgent,
          referer,
          refererHost,
        },
      }),
    ])
    .catch(() => {
      // silently ignore analytics errors so redirect is not blocked
    });

  return NextResponse.redirect(link.longUrl, 301);
}
