"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBar,
  House,
  Receipt,
  Scales,
} from "@phosphor-icons/react";
import { primaryNav } from "@/components/nav-items";
import { cn } from "@/lib/utils";

const icons = {
  House,
  Receipt,
  Scales,
  ChartBar,
} as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar({ userLabel }: { userLabel: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-border bg-card md:flex md:flex-col">
      <div className="flex h-14 items-center border-b border-border px-4">
        <span className="text-base font-semibold tracking-tight text-foreground">
          AnTrua
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Chính">
        {primaryNav.map((item) => {
          const Icon = icons[item.icon];
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors active:scale-[0.98]",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-accent hover:text-foreground",
              )}
            >
              {active ? (
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-primary"
                />
              ) : null}
              <Icon size={20} weight={active ? "fill" : "regular"} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4 text-sm text-muted">{userLabel}</div>
    </aside>
  );
}
