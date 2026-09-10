import { redirect } from "next/navigation";
import {
  ChartBar,
  ForkKnife,
  Scales,
} from "@phosphor-icons/react/dist/ssr";
import { LoginForm } from "@/components/login-form";
import { getSessionUser } from "@/lib/auth";

const highlights = [
  {
    icon: ForkKnife,
    title: "Chi tiêu nhóm",
    body: "Ghi nhận bữa trưa, chia đều hoặc theo phần — rõ người trả.",
  },
  {
    icon: Scales,
    title: "Công nợ FIFO",
    body: "Netting tự động, số khớp với sổ cũ — không đoán công thức.",
  },
  {
    icon: ChartBar,
    title: "Báo cáo công khai",
    body: "Share token cho nhóm xem tổng hợp đã xác nhận.",
  },
] as const;

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/");

  return (
    <div className="grid min-h-[100dvh] bg-background lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <aside
        className="relative hidden overflow-hidden text-white lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-12 xl:px-16"
        style={{ backgroundColor: "#1C1D1F" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(58,189,175,0.28), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -right-16 size-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,194,105,0.18), transparent 70%)" }}
        />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/90">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: "#3ABDAF" }} />
            AnTrua · QLTD v2
          </div>
          <h1 className="mt-8 max-w-md text-4xl font-semibold leading-[1.1] tracking-tight xl:text-5xl">
            Quản lý ăn trưa
            <span className="mt-3 block" style={{ color: "#3ABDAF" }}>
              rõ nợ, rõ người.
            </span>
          </h1>
          <p className="mt-5 max-w-[38ch] text-base leading-relaxed text-white/70">
            Workspace Attio cho nhóm — chi phí, công nợ và báo cáo trong một
            giao diện gọn.
          </p>
        </div>

        <ul className="relative z-10 mt-12 space-y-3">
          {highlights.map((item) => (
            <li
              key={item.title}
              className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.07] p-4"
            >
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(58,189,175,0.18)", color: "#3ABDAF" }}
              >
                <item.icon size={20} weight="duotone" />
              </span>
              <div>
                <p className="text-sm font-semibold tracking-tight text-white">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/60">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="relative z-10 mt-10 text-xs text-white/40">
          Session bảo mật · Multi-tenant theo nhóm
        </p>
      </aside>

      <main className="relative flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-20">
        <div className="mb-8 lg:hidden">
          <p className="text-xs font-semibold tracking-wide text-brand">AnTrua</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Đăng nhập
          </h1>
          <p className="mt-1 text-sm text-muted">
            Quản lý chi tiêu nhóm ăn trưa
          </p>
        </div>

        <div className="mx-auto w-full max-w-[400px] rounded-xl border border-border bg-card p-6 shadow-[0_12px_40px_-24px_rgba(28,29,31,0.35)] sm:p-8">
          <div className="mb-6 hidden lg:block">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Chào mừng trở lại
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Đăng nhập để tiếp tục workspace của nhóm.
            </p>
          </div>
          <LoginForm />
        </div>

        {process.env.NODE_ENV === "development" ? (
          <p className="mx-auto mt-6 max-w-[400px] text-center text-xs text-muted">
            Dev seed:{" "}
            <span className="font-mono text-foreground">ngotiendat</span> /{" "}
            <span className="font-mono text-foreground">123456</span>
          </p>
        ) : null}
      </main>
    </div>
  );
}
