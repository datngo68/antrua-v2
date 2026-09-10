import { AppShell } from "@/components/app-shell";

export default function ExpensesPage() {
  return (
    <AppShell userLabel="Dev">
      <h1 className="text-2xl font-semibold tracking-tight">Chi phí</h1>
      <p className="mt-2 text-muted">Sắp có ở P1.</p>
    </AppShell>
  );
}
