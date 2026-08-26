import { NextRequest, NextResponse } from "next/server";
import { isCollection, listEntries, entryExists, writeEntry } from "@/lib/content";
import { commitChange } from "@/lib/git";
import { slugify } from "@/lib/slug";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Coleção inválida." }, { status: 404 });
  }
  return NextResponse.json({ entries: listEntries(collection) });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Coleção inválida." }, { status: 404 });
  }

  const { body, ...data } = await req.json();
  const title = String(data.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "O título é obrigatório." }, { status: 400 });

  const slug = slugify(title);
  if (!slug) {
    return NextResponse.json({ error: "Não foi possível gerar o endereço." }, { status: 400 });
  }
  if (entryExists(collection, slug)) {
    return NextResponse.json({ error: "Já existe um conteúdo com esse título." }, { status: 409 });
  }

  writeEntry(collection, slug, data, String(body ?? ""));
  await commitChange(`conteudo: cria ${collection}/${slug}`, [`content/${collection}/${slug}.md`]);

  return NextResponse.json({ slug }, { status: 201 });
}
