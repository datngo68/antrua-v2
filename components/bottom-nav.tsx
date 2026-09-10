"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBar,
  DotsThreeCircle,
  Gear,
  House,
  Receipt,
  Scales,
  SignOut,
  Users,
} from "@phosphor-icons/react";
import { moreNav, primaryNav } from "@/components/nav-items";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { canManageGroup } from "@/lib/roles";
import { cn } from "@/lib/utils";

const icons = {
  House,
  Receipt,
  Scales,
  ChartBar,
} as const;

const moreIcons = {
  "/group": Users,
  "/settings": Gear,
} as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav({
  userLabel,
  role,
  onLogout,
}: {
  userLabel: string;
  role: string;
  onLogout?: () => void;
}) {
  const pathname = usePathname();
  const sheetItems = moreNav.filter(
    (item) => !item.adminOnly || canManageGroup(role),
  );

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm md:hidden"
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
                  active ? "text-primary" : "text-[#666666]",
                )}
              >
                {active ? (
                  <span
                    aria-hidden
                    className="absolute top-0 h-0.5 w-8 rounded-b bg-primary"
                  />
                ) : null}
                <Icon size={22} weight={active ? "fill" : "regular"} />
                {item.label === "Công nợ" ? "Nợ" : item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <Sheet>
            <SheetTrigger className="flex min-h-14 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-[#666666] active:scale-[0.98]">
              <DotsThreeCircle size={22} />
              Thêm
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-xl">
              <SheetHeader>
                <SheetTitle>Thêm</SheetTitle>
                <p className="text-sm text-[#666666]">{userLabel}</p>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4 pb-6">
                {sheetItems.map((item) => {
                  const Icon = moreIcons[item.href as keyof typeof moreIcons];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-foreground hover:bg-[#F4F5F7] active:scale-[0.98]"
                    >
                      {Icon ? <Icon size={18} /> : null}
                      {item.label}
                    </Link>
                  );
                })}
                {onLogout ? (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-destructive hover:bg-[#F4F5F7] active:scale-[0.98]"
                  >
                    <SignOut size={18} />
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
