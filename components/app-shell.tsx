"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { BottomNav } from "@/components/bottom-nav";

export function AppShell({
  children,
  userLabel,
  onLogout,
}: {
  children: React.ReactNode;
  userLabel: string;
  onLogout?: () => void;
}) {
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
