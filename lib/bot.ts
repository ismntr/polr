/**
 * Bot detection utility.
 * Filters known crawler/bot user-agents to prevent
 * inflated click statistics.
 */

const BOT_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /mediapartners/i,
  /feedfetcher/i,
  /lighthouse/i,
  /pingdom/i,
  /pagespeed/i,
  /headlesschrome/i,
  /phantomjs/i,
  /prerender/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /slackbot/i,
  /applebot/i,
  /bingpreview/i,
  /yandex/i,
  /baiduspider/i,
  /duckduckbot/i,
  /semrushbot/i,
  /ahrefsbot/i,
  /dotbot/i,
  /rogerbot/i,
  /embedly/i,
  /quora link preview/i,
  /redditbot/i,
  /ia_archiver/i,
  /wget/i,
  /curl/i,
  /python-requests/i,
  /go-http-client/i,
  /httpx/i,
  /node-fetch/i,
  /axios/i,
  /java\//i,
  /okhttp/i,
  /uptimerobot/i,
];

/** Returns true if the user-agent string matches a known bot pattern. */
export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}
