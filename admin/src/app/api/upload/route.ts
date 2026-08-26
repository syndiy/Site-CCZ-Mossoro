import { NextRequest, NextResponse } from "next/server";
import { saveImage } from "@/lib/content";
import { commitChange } from "@/lib/git";

const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Envie um arquivo de imagem." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Imagem muito grande (máximo 8 MB)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const publicPath = saveImage(`${Date.now()}-${file.name}`, buffer);

  await commitChange(`conteudo: adiciona imagem ${publicPath}`, [`public${publicPath}`]);

  return NextResponse.json({ path: publicPath });
}
