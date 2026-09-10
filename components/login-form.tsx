"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SpinnerGap } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, remember }),
      });
      if (!res.ok) {
        setError("Sai tên đăng nhập hoặc mật khẩu");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError("Không kết nối được máy chủ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username" className="text-foreground">
          Tên đăng nhập
        </Label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-invalid={!!error}
          required
          className="h-11 rounded-md bg-background px-3 text-sm"
          placeholder="vd. ngotiendat"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-foreground">
          Mật khẩu
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!error}
          required
          className="h-11 rounded-md bg-background px-3 text-sm"
          placeholder="••••••••"
        />
      </div>

      <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-muted">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="size-4 rounded border-border accent-primary"
        />
        Ghi nhớ đăng nhập trên thiết bị này
      </label>

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className={cn(
          "h-11 w-full rounded-md text-sm font-semibold active:scale-[0.98]",
        )}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <SpinnerGap className="size-4 animate-spin" />
            Đang đăng nhập…
          </span>
        ) : (
          "Đăng nhập"
        )}
      </Button>
    </form>
  );
}
