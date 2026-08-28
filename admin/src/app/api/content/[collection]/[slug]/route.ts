import { NextRequest, NextResponse } from "next/server";
import { isCollection, readEntry, entryExists, writeEntry, deleteEntry } from "@/lib/content";
import { commitChange } from "@/lib/git";

type Context = { params: Promise<{ collection: string; slug: string }> };

export async function GET(_req: NextRequest, { params }: Context) {
  const { collection, slug } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Coleção inválida." }, { status: 404 });
  }
  const entry = readEntry(collection, slug);
  if (!entry) return NextResponse.json({ error: "Conteúdo não encontrado." }, { status: 404 });
  return NextResponse.json(entry);
}

export async function PUT(req: NextRequest, { params }: Context) {
  const { collection, slug } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Coleção inválida." }, { status: 404 });
  }
  if (!entryExists(collection, slug)) {
    return NextResponse.json({ error: "Conteúdo não encontrado." }, { status: 404 });
  }

  const { body, ...data } = await req.json();
  if (!String(data.title ?? "").trim()) {
    return NextResponse.json({ error: "O título é obrigatório." }, { status: 400 });
  }

  const current = readEntry(collection, slug);
  const nextData = { ...current?.data, ...data };
  if (collection === "articles") {
    const hasHome = Object.prototype.hasOwnProperty.call(data, "home");
    const hasFeatured = Object.prototype.hasOwnProperty.call(data, "featured");
    if (hasHome || hasFeatured) {
      const home = hasHome ? Boolean(data.home) : Boolean(data.featured);
      nextData.home = home;
      nextData.featured = home;
    }
  }
  writeEntry(collection, slug, nextData, String(body ?? ""));
  try {
    await commitChange(`conteudo: atualiza ${collection}/${slug}`, [
      `content/${collection}/${slug}.md`,
    ]);
  } catch {
    if (current) writeEntry(collection, slug, current.data, current.body);
    return NextResponse.json({ error: "Não foi possível registrar a alteração." }, { status: 500 });
  }

  return NextResponse.json({ slug });
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  const { collection, slug } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Coleção inválida." }, { status: 404 });
  }
  if (!entryExists(collection, slug)) {
    return NextResponse.json({ error: "Conteúdo não encontrado." }, { status: 404 });
  }

  const current = readEntry(collection, slug);
  if (!current) return NextResponse.json({ error: "Conteúdo não encontrado." }, { status: 404 });
  deleteEntry(collection, slug);
  try {
    await commitChange(`conteudo: remove ${collection}/${slug}`, [
      `content/${collection}/${slug}.md`,
    ]);
  } catch {
    writeEntry(collection, slug, current.data, current.body);
    return NextResponse.json({ error: "Não foi possível registrar a remoção." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
