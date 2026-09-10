"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChartBar,
  Gear,
  House,
  Receipt,
  Scales,
  SidebarSimple,
  SignOut,
  Users,
} from "@phosphor-icons/react";
import { primaryNav, secondaryNav, type NavIcon } from "@/components/nav-items";
import { cn } from "@/lib/utils";

const icons: Record<NavIcon, typeof House> = {
  House,
  Receipt,
  Scales,
  ChartBar,
  Users,
  Gear,
};

const STORAGE_KEY = "antrua.sidebar.collapsed";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  icon,
  collapsed,
  pathname,
}: {
  href: string;
  label: string;
  icon: NavIcon;
  collapsed: boolean;
  pathname: string;
}) {
  const Icon = icons[icon];
  const active = isActive(pathname, href);

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      className={cn(
        "group relative flex min-h-11 items-center gap-3 rounded-lg text-sm font-medium transition-colors duration-150 active:scale-[0.98]",
        collapsed ? "justify-center px-0" : "px-3",
        active
          ? "bg-primary/10 text-primary"
          : "text-[#666666] hover:bg-[#F4F5F7] hover:text-foreground",
      )}
    >
      {active ? (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary"
        />
      ) : null}
      <Icon
        size={20}
        weight={active ? "fill" : "regular"}
        className="shrink-0"
      />
      {!collapsed ? <span className="truncate">{label}</span> : null}
    </Link>
  );
}

export function AppSidebar({
  userLabel,
  onLogout,
  onCollapsedChange,
}: {
  userLabel: string;
  onLogout?: () => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const next = stored === "1";
    setCollapsed(next);
    onCollapsedChange?.(next);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount hydrate only
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    onCollapsedChange?.(next);
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-card md:flex md:flex-col",
        "transition-[width] duration-200 ease-out",
        ready ? (collapsed ? "w-[72px]" : "w-60") : "w-60",
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-border",
          collapsed ? "justify-center px-2" : "justify-between gap-2 px-3",
        )}
      >
        {!collapsed ? (
          <div className="min-w-0 pl-1">
            <p className="truncate text-[15px] font-semibold tracking-tight text-foreground">
              AnTrua
            </p>
            <p className="truncate text-[11px] text-[#666666]">QLTD workspace</p>
          </div>
        ) : null}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          aria-expanded={!collapsed}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F4F5F7] hover:text-foreground active:scale-[0.98]"
        >
          {collapsed ? (
            <span className="flex size-7 items-center justify-center rounded-md bg-primary/12 text-[11px] font-bold text-primary">
              A
            </span>
          ) : (
            <SidebarSimple size={18} />
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-2.5">
        <nav className="flex flex-col gap-0.5" aria-label="Chính">
          {!collapsed ? (
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#97A0AF]">
              Làm việc
            </p>
          ) : null}
          {primaryNav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              collapsed={collapsed}
              pathname={pathname}
            />
          ))}
        </nav>

        <nav className="flex flex-col gap-0.5" aria-label="Quản trị">
          {!collapsed ? (
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#97A0AF]">
              Quản trị
            </p>
          ) : (
            <div className="mx-auto mb-1 h-px w-6 bg-border" aria-hidden />
          )}
          {secondaryNav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              collapsed={collapsed}
              pathname={pathname}
            />
          ))}
        </nav>
      </div>

      <div
        className={cn(
          "shrink-0 border-t border-border p-2.5",
          collapsed && "flex flex-col items-center gap-1",
        )}
      >
        {!collapsed ? (
          <div className="mb-1.5 flex items-center gap-2.5 rounded-lg px-2 py-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
              {userLabel.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {userLabel}
              </p>
              <p className="truncate text-[11px] text-[#666666]">Đã đăng nhập</p>
            </div>
          </div>
        ) : (
          <span
            title={userLabel}
            className="mb-1 flex size-8 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary"
          >
            {userLabel.slice(0, 1).toUpperCase()}
          </span>
        )}
        {onLogout ? (
          <button
            type="button"
            onClick={onLogout}
            title={collapsed ? "Đăng xuất" : undefined}
            aria-label="Đăng xuất"
            className={cn(
              "flex min-h-10 w-full items-center gap-3 rounded-lg text-sm font-medium text-[#666666] transition-colors hover:bg-[#F4F5F7] hover:text-destructive active:scale-[0.98]",
              collapsed ? "justify-center px-0" : "px-3",
            )}
          >
            <SignOut size={18} />
            {!collapsed ? "Đăng xuất" : null}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
