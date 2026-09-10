import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function ExpensesPage() {
  const user = await requireUser();
  return (
    <AppShell userLabel={user.fullName}>
      <h1 className="text-2xl font-semibold tracking-tight">Chi phí</h1>
      <p className="mt-2 text-muted">Sắp có ở P1.</p>
    </AppShell>
  );
}
