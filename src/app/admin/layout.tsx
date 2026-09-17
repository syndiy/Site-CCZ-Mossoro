import { AdminNav } from "@/components/admin/AdminNav";
import { AuthGuard } from "@/components/admin/auth-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/30">
        <AdminNav />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
