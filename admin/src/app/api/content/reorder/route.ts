import { NextRequest, NextResponse } from "next/server";
import { isCollection, updateEntryFields } from "@/lib/content";
import { commitChange } from "@/lib/git";

type ReorderItem = {
  collection: string;
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

  const files: string[] = [];
  try {
    for (const item of items) {
      if (!isCollection(item.collection) || !/^[a-z0-9-]+$/.test(item.slug)) {
        return NextResponse.json({ error: "Conteudo invalido." }, { status: 400 });
      }
      if (!Number.isInteger(item.homeOrder) || item.homeOrder < 1) {
        return NextResponse.json({ error: "Ordem invalida." }, { status: 400 });
      }
      updateEntryFields(item.collection, item.slug, {
        home: item.home,
        homeOrder: item.homeOrder,
      });
      files.push(`content/${item.collection}/${item.slug}.md`);
    }
  } catch {
    return NextResponse.json({ error: "Nao foi possivel reorganizar o conteudo." }, { status: 404 });
  }

  await commitChange("conteudo: reorganiza pagina inicial", [...new Set(files)]);
  return NextResponse.json({ ok: true });
}
