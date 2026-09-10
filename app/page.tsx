import { AppShell } from "@/components/app-shell";

export default function HomePage() {
  return (
    <AppShell userLabel="Dev">
      <h1 className="text-2xl font-semibold tracking-tight">Tổng quan</h1>
      <p className="mt-2 text-muted">Dashboard sẽ có ở P3.</p>
    </AppShell>
  );
}
