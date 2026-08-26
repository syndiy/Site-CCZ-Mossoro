import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from "remark-unwrap-images";
import rehypeSlug from "rehype-slug";
import { Paw } from "@/components/shared/illustrations";

const components: Components = {
  h2: ({ children, ...props }) => (
    <h2 {...props} className="scroll-mt-28 pt-10 text-2xl font-bold text-ink md:text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => <h3 className="mt-8 text-xl font-semibold text-ink">{children}</h3>,
  p: ({ children }) => <p className="mt-4 leading-relaxed text-ink-soft">{children}</p>,
  a: ({ children, href }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        className="font-medium text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-800"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => <ul className="mt-5 flex flex-col gap-3 text-ink-soft">{children}</ul>,
  ol: ({ children }) => (
    <ol className="mt-5 flex list-decimal flex-col gap-3 pl-5 text-ink-soft marker:font-semibold marker:text-brand-600">
      {children}
    </ol>
  ),
  li: ({ children }) => {
    return (
      <li className="flex items-start gap-3 [ol_&]:list-item [ol_&]:pl-1">
        <Paw className="mt-1 size-4 shrink-0 fill-brand-600 [ol_&]:hidden" />
        <span>{children}</span>
      </li>
    );
  },
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-4 border-brand-300 bg-info-50 py-1 pl-5 text-ink-soft">
      {children}
    </blockquote>
  ),
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      <figure className="mt-8 overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-soft">
        <img src={src} alt={alt ?? ""} loading="lazy" className="h-auto w-full" />
        {alt ? (
          <figcaption className="border-t border-line/70 px-5 py-3 text-sm text-muted-foreground">
            {alt}
          </figcaption>
        ) : null}
      </figure>
    ) : null,
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkUnwrapImages]}
        rehypePlugins={[rehypeSlug]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
