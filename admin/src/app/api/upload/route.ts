import { NextRequest, NextResponse } from "next/server";
import { removeImage, saveImage, uniqueImageName } from "@/lib/content";
import { commitChange } from "@/lib/git";

const MAX_SIZE = 8 * 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }
  if (!IMAGE_TYPES[file.type]) {
    return NextResponse.json({ error: "Use uma imagem JPG, PNG ou WebP." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Imagem muito grande (máximo 8 MB)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const publicPath = saveImage(uniqueImageName(IMAGE_TYPES[file.type]), buffer);

  try {
    await commitChange(`conteudo: adiciona imagem ${publicPath}`, [`public${publicPath}`]);
  } catch {
    removeImage(publicPath);
    return NextResponse.json({ error: "Não foi possível registrar a imagem." }, { status: 500 });
  }

  return NextResponse.json({ path: publicPath });
}
