import { NextRequest, NextResponse } from "next/server";
import { deleteEntry, isCollection, listEntries, entryExists, writeEntry } from "@/lib/content";
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

  const nextData = { ...data };
  if (collection === "articles") {
    const home = Boolean(nextData.featured ?? nextData.home);
    nextData.home = home;
    nextData.featured = home;
  }
  writeEntry(collection, slug, nextData, String(body ?? ""));
  try {
    await commitChange(`conteudo: cria ${collection}/${slug}`, [`content/${collection}/${slug}.md`]);
  } catch {
    deleteEntry(collection, slug);
    return NextResponse.json({ error: "Não foi possível registrar a criação." }, { status: 500 });
  }

  return NextResponse.json({ slug }, { status: 201 });
}
