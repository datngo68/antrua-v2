import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function PaymentsPage() {
  const user = await requireUser();
  return (
    <AppShell userLabel={user.fullName}>
      <h1 className="text-2xl font-semibold tracking-tight">Nợ</h1>
      <p className="mt-2 text-muted">Sắp có ở P2.</p>
    </AppShell>
  );
}
