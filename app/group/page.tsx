import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function GroupPage() {
  const user = await requireUser();
  return (
    <AppShell userLabel={user.fullName}>
      <h1 className="text-2xl font-semibold tracking-tight">Nhóm</h1>
      <p className="mt-2 text-muted">Sắp có ở P5.</p>
    </AppShell>
  );
}