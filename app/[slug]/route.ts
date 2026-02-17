import { NextRequest, NextResponse, after } from "next/server";
import { sql } from "@/lib/db";
import { headers } from "next/headers";
import { isBot } from "@/lib/bot";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const rows = await sql`
    SELECT id, short_url, long_url, is_disabled
    FROM links
    WHERE short_url = ${slug}
    LIMIT 1
  `;

  const link = rows[0];

  if (!link || link.is_disabled) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // ── Collect request metadata ────────────────────────────────
  const headersList = await headers();
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

  // ── Record click after response (survives Vercel shutdown) ──
  if (!isBot(userAgent)) {
    after(async () => {
      try {
        await sql`UPDATE links SET clicks = clicks + 1, updated_at = NOW() WHERE id = ${link.id}`;
        await sql`
          INSERT INTO clicks (link_id, ip, user_agent, referer, referer_host, created_at, updated_at)
          VALUES (${link.id}, ${ip}, ${userAgent}, ${referer}, ${refererHost}, NOW(), NOW())
        `;
      } catch (err) {
        console.error("Failed to record click analytics:", err);
      }
    });
  }

  return NextResponse.redirect(link.long_url, 301);
}
