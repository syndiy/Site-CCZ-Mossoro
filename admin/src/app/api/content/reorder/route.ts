import { NextRequest, NextResponse } from "next/server";
import { entryExists, isCollection, updateEntryFields, type Collection } from "@/lib/content";
import { commitChange } from "@/lib/git";

type ReorderItem = {
  collection: Collection;
  slug: string;
  home: boolean;
  homeOrder: number;
};

export async function PUT(req: NextRequest) {
  const payload = (await req.json().catch(() => null)) as { items?: ReorderItem[] } | null;
  const items = payload?.items;

  if (!Array.isArray(items) || items.length > 100) {
    return NextResponse.json({ error: "Lista de ordenacao invalida." }, { status: 400 });
  }

  const keys = new Set<string>();
  const orders = new Set<string>();
  for (const item of items) {
    if (!isCollection(item.collection) || !/^[a-z0-9-]+$/.test(item.slug)) {
      return NextResponse.json({ error: "Conteudo invalido." }, { status: 400 });
    }
    if (typeof item.home !== "boolean") {
      return NextResponse.json({ error: "Status de destaque invalido." }, { status: 400 });
    }
    if (!Number.isInteger(item.homeOrder) || item.homeOrder < 1) {
      return NextResponse.json({ error: "Ordem invalida." }, { status: 400 });
    }
    if (!entryExists(item.collection, item.slug)) {
      return NextResponse.json({ error: "Conteudo nao encontrado." }, { status: 404 });
    }
    const key = `${item.collection}:${item.slug}`;
    const orderKey = `${item.collection}:${item.home}:${item.homeOrder}`;
    if (keys.has(key) || orders.has(orderKey)) {
      return NextResponse.json({ error: "A lista de organizacao possui duplicidades." }, { status: 400 });
    }
    keys.add(key);
    orders.add(orderKey);
  }

  const files: string[] = [];
  try {
    for (const item of items) {
      updateEntryFields(item.collection, item.slug, {
        home: item.home,
        homeOrder: item.homeOrder,
        ...(item.collection === "articles" ? { featured: item.home } : {}),
      });
      files.push(`content/${item.collection}/${item.slug}.md`);
    }
  } catch {
    return NextResponse.json({ error: "Nao foi possivel reorganizar o conteudo." }, { status: 404 });
  }

  await commitChange("conteudo: reorganiza pagina inicial", [...new Set(files)]);
  return NextResponse.json({ ok: true });
}
