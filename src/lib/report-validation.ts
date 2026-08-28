export const MAX_REPORT_IMAGE_SIZE = 8 * 1024 * 1024;

export const SUPPORTED_REPORT_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export function validateReportImage(file: Pick<File, "type" | "size">): string | null {
  if (!SUPPORTED_REPORT_IMAGE_TYPES.includes(file.type as (typeof SUPPORTED_REPORT_IMAGE_TYPES)[number])) {
    return "Use uma imagem JPG, PNG ou WebP.";
  }

  if (file.size > MAX_REPORT_IMAGE_SIZE) {
    return "A imagem deve ter no máximo 8 MB.";
  }

  return null;
}
