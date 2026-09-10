"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "antrua.sidebar.collapsed";

export function AppShell({
  children,
  userLabel,
  role,
}: {
  children: React.ReactNode;
  userLabel: string;
  role: string;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <AppSidebar
        userLabel={userLabel}
        role={role}
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
      <BottomNav userLabel={userLabel} role={role} onLogout={onLogout} />
    </div>
  );
}
