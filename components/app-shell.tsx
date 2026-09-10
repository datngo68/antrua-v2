"use client";

import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNav } from "@/components/bottom-nav";

export function AppShell({
  children,
  userLabel,
}: {
  children: React.ReactNode;
  userLabel: string;
}) {
  const router = useRouter();

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <AppSidebar userLabel={userLabel} />
      <div className="md:pl-60">
        <main className="mx-auto max-w-[1400px] px-4 py-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
      <BottomNav userLabel={userLabel} onLogout={onLogout} />
    </div>
  );
}
