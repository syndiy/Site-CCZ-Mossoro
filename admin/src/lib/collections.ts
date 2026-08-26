import type { Collection } from "./content";

export type FieldType = "text" | "textarea" | "date" | "tags" | "image" | "toggle";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
};

export type CollectionConfig = {
  name: Collection;
  singular: string;
  plural: string;
  createLabel: string;
  sitePath: string;
  fields: Field[];
};

const coverFields: Field[] = [
  { name: "cover", label: "Imagem de capa", type: "image" },
  {
    name: "coverAlt",
    label: "Descrição da imagem",
    type: "text",
    hint: "Lida em voz alta para pessoas com deficiência visual.",
  },
];

const dateAndTags: Field[] = [
  { name: "publishedAt", label: "Data de publicação", type: "date" },
  { name: "tags", label: "Tags", type: "tags", hint: "Separe por vírgula. Ex.: dengue, prevenção" },
];

export const collections: Record<Collection, CollectionConfig> = {
  articles: {
    name: "articles",
    singular: "Artigo",
    plural: "Artigos",
    createLabel: "Novo artigo",
    sitePath: "/articles",
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      {
        name: "description",
        label: "Resumo",
        type: "textarea",
        hint: "Aparece na listagem e no resultado do Google.",
      },
      { name: "eyebrow", label: "Categoria", type: "text", hint: "Ex.: Educação em saúde" },
      ...coverFields,
      ...dateAndTags,
      {
        name: "featured",
        label: "Destacar na página inicial",
        type: "toggle",
        hint: "Artigos destacados aparecem na home do site.",
      },
    ],
  },
  news: {
    name: "news",
    singular: "Notícia",
    plural: "Notícias",
    createLabel: "Nova notícia",
    sitePath: "/news",
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      {
        name: "excerpt",
        label: "Chamada",
        type: "textarea",
        hint: "Aparece na listagem e no resultado do Google.",
      },
      ...coverFields,
      ...dateAndTags,
    ],
  },
};

export const defaultValues = (config: CollectionConfig): Record<string, string | boolean> => {
  const values: Record<string, string | boolean> = {};
  for (const field of config.fields) {
    if (field.type === "toggle") values[field.name] = false;
    else if (field.type === "date") values[field.name] = new Date().toISOString().slice(0, 10);
    else if (field.name === "eyebrow") values[field.name] = "Educação em saúde";
    else values[field.name] = "";
  }
  return values;
};

export const toFormValues = (
  config: CollectionConfig,
  data: Record<string, unknown>,
): Record<string, string | boolean> => {
  const values = defaultValues(config);
  for (const field of config.fields) {
    const raw = data[field.name];
    if (raw === undefined || raw === null) continue;
    if (field.type === "toggle") values[field.name] = Boolean(raw);
    else if (field.type === "tags") values[field.name] = Array.isArray(raw) ? raw.join(", ") : String(raw);
    else if (field.type === "date") values[field.name] = String(raw).slice(0, 10);
    else values[field.name] = String(raw);
  }
  return values;
};

export const toPayload = (
  config: CollectionConfig,
  values: Record<string, string | boolean>,
): Record<string, unknown> => {
  const payload: Record<string, unknown> = {};
  for (const field of config.fields) {
    const value = values[field.name];
    if (field.type === "tags") {
      payload[field.name] = String(value)
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    } else {
      payload[field.name] = value;
    }
  }
  return payload;
};
