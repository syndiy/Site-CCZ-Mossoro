import { NextRequest, NextResponse } from "next/server";
import { readImage } from "@/lib/content";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const filename = segments.join("/");
  const buffer = readImage(filename);

  if (!buffer) return NextResponse.json({ error: "Imagem não encontrada." }, { status: 404 });

  const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();

  return new NextResponse(new Uint8Array(buffer), {
    headers: { "Content-Type": CONTENT_TYPES[extension] ?? "application/octet-stream" },
  });
}
