import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await requireUser();
  return (
    <AppShell userLabel={user.fullName}>
      <h1 className="text-2xl font-semibold tracking-tight">Tổng quan</h1>
      <p className="mt-2 text-muted">Dashboard sẽ có ở P3.</p>
    </AppShell>
  );
}
