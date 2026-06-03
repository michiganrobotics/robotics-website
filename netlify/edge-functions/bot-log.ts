import type { Context } from "https://edge.netlify.com";

// Phase 1: identify the bot. Fires only on WordPress-style probe paths
// (no real content lives there, so legitimate visitors are never touched).
// Captures the request's user-agent / IP / geo and ships it to an external
// collector so we can see it without Netlify's paid log retention.
//
// Set BOT_LOG_WEBHOOK in the Netlify UI (Site config -> Environment variables)
// to a https://webhook.site unique URL (or any endpoint that accepts a POST).

export default async function (request: Request, context: Context) {
  try {
    const url = new URL(request.url);
    const record = {
      time: new Date().toISOString(),
      method: request.method,
      path: url.pathname + url.search,
      ua: request.headers.get("user-agent") || "",
      ip: context.ip || "",
      country: context.geo?.country?.code || "",
      city: context.geo?.city || "",
      referer: request.headers.get("referer") || "",
    };

    // Always log (visible in Netlify's live function log stream if available).
    console.log("BOT_PROBE", JSON.stringify(record));

    // Also ship to an external sink so it's visible regardless of Netlify tier.
    const sink = Deno.env.get("BOT_LOG_WEBHOOK");
    if (sink) {
      // Don't block the response on the webhook round-trip.
      context.waitUntil(
        fetch(sink, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        }).catch(() => {})
      );
    }
  } catch (_e) {
    // Never let logging break the response.
  }

  // These paths have no real content; respond 404 as before.
  return new Response("Not Found", {
    status: 404,
    headers: { "Content-Type": "text/plain" },
  });
}
