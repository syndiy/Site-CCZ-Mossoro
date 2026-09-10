import Link from "next/link";

export function BackLink({
  href = "/",
  children = "Voltar para a lista",
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link href={href} className="back-link">
      {children}
    </Link>
  );
}
