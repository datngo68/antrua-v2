import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await requireUser();
  return (
    <AppShell userLabel={user.fullName}>
      <h1 className="text-2xl font-semibold tracking-tight">Cài đặt</h1>
      <p className="mt-2 text-muted">Sắp có.</p>
    </AppShell>
  );
}
