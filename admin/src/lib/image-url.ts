export function editorImageUrl(value: string): string {
  if (!value.startsWith("/img/")) return value;

  return `/api/images/${value
    .slice("/img/".length)
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}
