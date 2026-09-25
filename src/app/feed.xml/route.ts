import { feedRss } from "@/lib/descoberta";

export const dynamic = "force-static";

export function GET() {
  return new Response(feedRss(), { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
