"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  userLabel,
}: {
  children: React.ReactNode;
  userLabel: string;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <AppSidebar
        userLabel={userLabel}
        onLogout={onLogout}
        onCollapsedChange={setCollapsed}
      />
      <div
        className={cn(
          "transition-[padding] duration-200 ease-out",
          collapsed ? "md:pl-[72px]" : "md:pl-60",
        )}
      >
        <main className="mx-auto max-w-[1400px] px-4 py-6 pb-20 md:px-6 md:pb-8 md:pt-7">
          {children}
        </main>
      </div>
      <BottomNav userLabel={userLabel} onLogout={onLogout} />
    </div>
  );
}
