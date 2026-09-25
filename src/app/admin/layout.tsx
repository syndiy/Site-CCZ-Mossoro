import { AdminNav } from "@/components/admin/AdminNav";
import { AuthGuard } from "@/components/admin/auth-guard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel de gestão | CCZ Mossoró",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/30 lg:flex">
        <AdminNav />
        <div className="min-w-0 flex-1"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 lg:py-10">{children}</div></div>
      </div>
    </AuthGuard>
  );
}
