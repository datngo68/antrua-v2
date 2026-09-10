import Link from "next/link";
import {
  ChartBar,
  Receipt,
  Scales,
  Users,
} from "@phosphor-icons/react/dist/ssr";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

const shortcuts = [
  {
    href: "/expenses",
    label: "Chi phí",
    hint: "CRUD + chia phần — P1",
    icon: Receipt,
    span: "md:col-span-2 md:row-span-2",
  },
  {
    href: "/payments",
    label: "Công nợ",
    hint: "FIFO + netting — P2",
    icon: Scales,
    span: "md:col-span-1",
  },
  {
    href: "/reports",
    label: "Báo cáo",
    hint: "Confirmed only — P4",
    icon: ChartBar,
    span: "md:col-span-1",
  },
  {
    href: "/group",
    label: "Nhóm",
    hint: "Thành viên — P5",
    icon: Users,
    span: "md:col-span-2",
  },
] as const;

export default async function HomePage() {
  const user = await requireUser();
  const first = user.fullName.split(/\s+/).pop() ?? user.fullName;

  return (
    <AppShell userLabel={user.fullName}>
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            Tổng quan
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">
            Xin chào, {first}
          </h1>
          <p className="mt-1.5 max-w-[52ch] text-sm leading-relaxed text-[#666666]">
            Workspace nhóm sẵn sàng. Số liệu dashboard đầy đủ sẽ lên ở P3 — hiện
            là lối tắt tới các module.
          </p>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 self-start rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-[#666666] sm:mt-0">
          <span className="size-1.5 rounded-full bg-primary" />
          Role · {user.role}
        </div>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 md:gap-4">
        {shortcuts.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors duration-150",
              "hover:border-primary/35 hover:bg-primary/[0.03] active:scale-[0.99]",
              item.span,
            ].join(" ")}
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              <item.icon size={22} weight="duotone" />
            </span>
            <div className={item.span.includes("row-span-2") ? "mt-10" : "mt-6"}>
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                {item.label}
              </h2>
              <p className="mt-1 text-sm text-[#666666]">{item.hint}</p>
            </div>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
