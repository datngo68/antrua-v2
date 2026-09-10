"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={logout}
      className={className ?? "justify-start text-destructive active:scale-[0.98]"}
    >
      Đăng xuất
    </Button>
  );
}
