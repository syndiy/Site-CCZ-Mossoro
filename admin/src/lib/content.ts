import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import matter from "gray-matter";

const REPO_ROOT = path.join(process.cwd(), "..");
const CONTENT_ROOT = path.join(REPO_ROOT, "content");
const IMAGE_ROOT = path.join(REPO_ROOT, "public", "img");

export type Collection = "articles" | "news";

export type EntryData = Record<string, unknown>;

export type Entry = { slug: string; data: EntryData; body: string };

export const isCollection = (value: string): value is Collection =>
  value === "articles" || value === "news";

function collectionDir(collection: Collection) {
  return path.join(CONTENT_ROOT, collection);
}

function entryPath(collection: Collection, slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("Endereço inválido.");
  return path.join(collectionDir(collection), `${slug}.md`);
}

export function listEntries(collection: Collection): Omit<Entry, "body">[] {
  const dir = collectionDir(collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      return { slug: file.replace(/\.md$/, ""), data: matter(raw).data };
    })
    .sort((a, b) =>
      String(b.data.publishedAt ?? "").localeCompare(String(a.data.publishedAt ?? "")),
    );
}

export function readEntry(collection: Collection, slug: string): Entry | null {
  const file = entryPath(collection, slug);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { slug, data, body: content };
}

export function entryExists(collection: Collection, slug: string): boolean {
  return fs.existsSync(entryPath(collection, slug));
}

export function writeEntry(
  collection: Collection,
  slug: string,
  data: EntryData,
  body: string,
): void {
  fs.mkdirSync(collectionDir(collection), { recursive: true });
  fs.writeFileSync(entryPath(collection, slug), matter.stringify(`${body.trim()}\n`, data), "utf8");
}

export function updateEntryFields(collection: Collection, slug: string, fields: EntryData): void {
  const entry = readEntry(collection, slug);
  if (!entry) throw new Error("Content not found.");
  writeEntry(collection, slug, { ...entry.data, ...fields }, entry.body);
}

export function deleteEntry(collection: Collection, slug: string): void {
  const file = entryPath(collection, slug);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

export function saveImage(filename: string, buffer: Buffer): string {
  fs.mkdirSync(IMAGE_ROOT, { recursive: true });
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  fs.writeFileSync(path.join(IMAGE_ROOT, safeName), buffer);
  return `/img/${safeName}`;
}

export function uniqueImageName(extension: string): string {
  return `${randomUUID()}${extension}`;
}

export function removeImage(publicPath: string): void {
  const file = path.join(IMAGE_ROOT, path.basename(publicPath));
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

export function readImage(filename: string): Buffer | null {
  const relative = filename.replace(/^\/?img\//, "");
  if (!relative || relative.split("/").some((part) => !part || part === "." || part === "..")) {
    return null;
  }
  const file = path.resolve(IMAGE_ROOT, relative);
  if (!file.startsWith(`${IMAGE_ROOT}${path.sep}`)) return null;
  return fs.existsSync(file) ? fs.readFileSync(file) : null;
}

export function listImages(): string[] {
  if (!fs.existsSync(IMAGE_ROOT)) return [];
  return fs
    .readdirSync(IMAGE_ROOT)
    .filter((file) => /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(file))
    .map((file) => `/img/${file}`);
}
