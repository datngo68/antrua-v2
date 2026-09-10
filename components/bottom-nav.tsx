"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBar,
  DotsThreeCircle,
  House,
  Receipt,
  Scales,
} from "@phosphor-icons/react";
import { moreNav, primaryNav } from "@/components/nav-items";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

export function BottomNav({
  userLabel,
  onLogout,
}: {
  userLabel: string;
  onLogout?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card md:hidden"
      aria-label="Điều hướng mobile"
    >
      <ul className="grid grid-cols-5">
        {primaryNav.map((item) => {
          const Icon = icons[item.icon];
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium active:scale-[0.98]",
                  active ? "text-primary" : "text-muted",
                )}
              >
                {active ? (
                  <span
                    aria-hidden
                    className="absolute top-0 h-0.5 w-8 rounded-b bg-primary"
                  />
                ) : null}
                <Icon size={22} weight={active ? "fill" : "regular"} />
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <Sheet>
            <SheetTrigger
              className={cn(
                "flex min-h-14 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted active:scale-[0.98]",
              )}
            >
              <DotsThreeCircle size={22} />
              Thêm
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-xl">
              <SheetHeader>
                <SheetTitle>Thêm</SheetTitle>
                <p className="text-sm text-muted">{userLabel}</p>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4 pb-6">
                {moreNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-foreground hover:bg-accent active:scale-[0.98]"
                  >
                    {item.label}
                  </Link>
                ))}
                {onLogout ? (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex min-h-11 items-center rounded-md px-3 text-left text-sm font-medium text-destructive hover:bg-accent active:scale-[0.98]"
                  >
                    Đăng xuất
                  </button>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </li>
      </ul>
    </nav>
  );
}
