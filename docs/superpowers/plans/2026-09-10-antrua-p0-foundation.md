# AnTrua P0 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap Next.js full-stack app với theme Attio + shell (sidebar/bottom nav) + session login đọc được user từ SQLite schema cũ.

**Architecture:** App Router; UI server-first; Client Components chỉ cho nav interactive và form login. Auth = iron-session (cookie) port semantics `UserId/Username/FullName/Role/GroupId`. Drizzle map bảng `Users` (P0 chỉ cần đọc/verify). Theme tokens từ `Design.md`.

**Tech Stack:** Next.js 15 · TypeScript · Tailwind CSS 4 · shadcn/ui · Drizzle ORM · better-sqlite3 · iron-session · bcryptjs · Geist · @phosphor-icons/react · Vitest

**Spec:** `docs/superpowers/specs/2026-09-10-antrua-ui-rebuild-design.md`  
**Domain:** `doc-rebuild/03-auth-tenancy.md`, `doc-rebuild/02-database-schema.md`

## Global Constraints

- Giữ tên bảng/cột SQLite PascalCase (`Users`, `PasswordHash`, …) — không rename.
- Password: BCrypt rounds 12 **và** MD5 hex 32 legacy (`doc-rebuild/03`).
- Visual: Attio teal `#3ABDAF`, hunter `#1C1D1F`, border `#EBECF0`, workspace `#F4F5F7`; radius 6–12px; **không** Inter; **không** emoji icons.
- Mobile: bottom nav ≤5; Desktop: sidebar; `min-h-[100dvh]` không `h-screen`.
- Conventional commits (`feat`, `fix`, `chore`, `docs`, `test`).
- YAGNI: P0 **không** port debt engine, expenses CRUD, integrations.
- DB path: env `ANTRUA_SQLITE_PATH` (absolute hoặc relative từ cwd). Dev có thể trỏ file DB cũ hoặc file seed tạm.

## Scope note

Plan này **chỉ P0**. P1–P7 = plan riêng sau khi P0 ship.

## File map (P0)

```
apps/web/   OR repo root (chọn root — YAGNI monorepo)
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── components.json          # shadcn
├── vitest.config.ts
├── .env.example
├── .gitignore
├── app/
│   ├── globals.css          # Attio tokens
│   ├── layout.tsx
│   ├── page.tsx             # Dashboard placeholder (protected)
│   ├── login/page.tsx
│   ├── expenses/page.tsx    # placeholder shell route
│   ├── payments/page.tsx
│   ├── reports/page.tsx
│   └── (shell)/...          # optional group — hoặc layout lồng
├── components/
│   ├── ui/                  # shadcn
│   ├── app-sidebar.tsx      # client
│   ├── bottom-nav.tsx       # client
│   ├── app-shell.tsx        # client wrapper
│   └── logout-button.tsx
├── lib/
│   ├── utils.ts
│   ├── db.ts                # drizzle client
│   ├── schema/users.ts
│   ├── password.ts
│   ├── session.ts
│   └── auth.ts              # getSessionUser / requireUser
└── tests/
    ├── password.test.ts
    └── session-shape.test.ts
```

---

### Task 1: Scaffold Next.js + tooling

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `.gitignore`, `.env.example`, `vitest.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css` (minimal)

**Interfaces:**
- Consumes: none
- Produces: runnable `npm run dev` on Next.js App Router

- [ ] **Step 1: Create Next app in repo root (TypeScript, Tailwind, App Router, no src dir)**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --turbopack --yes
```

Nếu create-next-app từ chối vì thư mục không trống: scaffold thủ công `package.json` với deps:

```json
{
  "name": "antrua",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  }
}
```

Rồi:

```bash
npm install next@15 react@19 react-dom@19
npm install -D typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss postcss eslint eslint-config-next vitest
```

- [ ] **Step 2: Write `.env.example`**

```env
ANTRUA_SQLITE_PATH=./data/antrua.dev.db
SESSION_PASSWORD=complex_password_at_least_32_characters_long
```

- [ ] **Step 3: Ensure `.gitignore` includes**

```
node_modules
.next
.env
.env.local
data/*.db
*.db-journal
```

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: Next ready, `/` returns 200.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs app .gitignore .env.example vitest.config.ts
git commit -m "chore: scaffold Next.js app for AnTrua P0"
```

---

### Task 2: Attio theme tokens + Geist font

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`
- Create: `lib/utils.ts` (nếu chưa có từ shadcn)

**Interfaces:**
- Consumes: Next font / Geist
- Produces: CSS variables `--color-brand: #3abdaf` … dùng bởi Tailwind `@theme`

- [ ] **Step 1: Install Geist**

```bash
npm install geist
```

- [ ] **Step 2: Replace `app/globals.css` với tokens Attio**

```css
@import "tailwindcss";

@theme inline {
  --color-background: #f4f5f7;
  --color-foreground: #1c1d1f;
  --color-card: #ffffff;
  --color-brand: #3abdaf;
  --color-brand-foreground: #ffffff;
  --color-muted: #666666;
  --color-border: #ebecf0;
  --color-destructive: #dc2626;
  --color-secondary: #8bc269;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
}
```

(Nếu Tailwind v3 thay vì v4: map tương đương trong `tailwind.config.ts` — kiểm `package.json` trước khi viết utility.)

- [ ] **Step 3: Wire font in `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnTrua",
  description: "Quản lý ăn trưa theo nhóm",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${GeistSans.variable} ${GeistMono.variable} min-h-[100dvh]`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Visual smoke** — mở `/`, nền `#f4f5f7`, font không phải Inter.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx package.json package-lock.json
git commit -m "feat: add Attio theme tokens and Geist fonts"
```

---

### Task 3: shadcn/ui + primitive components

**Files:**
- Create: `components.json`, `lib/utils.ts`, `components/ui/button.tsx`, `components/ui/input.tsx`, `components/ui/label.tsx`, `components/ui/card.tsx`, `components/ui/sheet.tsx`

**Interfaces:**
- Consumes: theme CSS variables
- Produces: `<Button>`, `<Input>`, `<Label>`, `<Card>`, `<Sheet>` themed brand teal

- [ ] **Step 1: Init shadcn (non-interactive nếu có flag)**

```bash
npx shadcn@latest init -y
npx shadcn@latest add button input label card sheet
```

- [ ] **Step 2: Map primary color tới brand teal** trong CSS/shadcn theme (`--primary: #3abdaf`, `--primary-foreground: #ffffff`, `--radius: 0.5rem`). Không để default violet.

- [ ] **Step 3: Install icons**

```bash
npm install @phosphor-icons/react
```

- [ ] **Step 4: Commit**

```bash
git add components components.json lib/utils.ts app/globals.css package.json package-lock.json
git commit -m "feat: add shadcn primitives themed to Attio"
```

---

### Task 4: App shell — sidebar + bottom nav

**Files:**
- Create: `components/app-sidebar.tsx`, `components/bottom-nav.tsx`, `components/app-shell.tsx`
- Modify: `app/page.tsx`
- Create: `app/expenses/page.tsx`, `app/payments/page.tsx`, `app/reports/page.tsx` (placeholders)

**Interfaces:**
- Consumes: `usePathname` from `next/navigation`; Phosphor icons
- Produces: `AppShell({ children, userLabel })` — desktop sidebar + mobile bottom nav (5 slots)

- [ ] **Step 1: Create nav config**

```tsx
// components/nav-items.ts
export const primaryNav = [
  { href: "/", label: "Tổng quan", icon: "House" },
  { href: "/expenses", label: "Chi phí", icon: "Receipt" },
  { href: "/payments", label: "Nợ", icon: "Scales" },
  { href: "/reports", label: "Báo cáo", icon: "ChartBar" },
] as const;
```

Slot 5 mobile = “Thêm” mở Sheet (Cài đặt `/settings`, Nhóm `/group`, Đăng xuất) — `/settings` và `/group` có thể placeholder 404-page tạm: tạo page stub “Sắp có”.

- [ ] **Step 2: Implement `AppSidebar` (hidden `< md`) + `BottomNav` (fixed `md:hidden`)**

Yêu cầu:
- Active state: text/brand + indicator (không chỉ màu).
- Touch target ≥44px.
- `aria-current="page"` trên link active.
- Main content: `pb-20 md:pb-0 md:pl-60`.

- [ ] **Step 3: Placeholder pages** mỗi route render trong `AppShell`:

```tsx
export default function ExpensesPage() {
  return (
    <AppShell userLabel="…">
      <h1 className="text-2xl font-semibold tracking-tight">Chi phí</h1>
      <p className="mt-2 text-muted">Sắp có ở P1.</p>
    </AppShell>
  );
}
```

- [ ] **Step 4: Manual check** — resize &lt;768px thấy bottom nav; ≥768px thấy sidebar; không horizontal scroll.

- [ ] **Step 5: Commit**

```bash
git add components app
git commit -m "feat: add responsive app shell with sidebar and bottom nav"
```

---

### Task 5: Drizzle + Users schema + SQLite client

**Files:**
- Create: `lib/schema/users.ts`, `lib/db.ts`
- Create: `data/.gitkeep`
- Modify: `.env.example`

**Interfaces:**
- Consumes: `ANTRUA_SQLITE_PATH`
- Produces: `db` drizzle instance; `users` table matching `Users` columns needed for auth

- [ ] **Step 1: Install**

```bash
npm install drizzle-orm better-sqlite3
npm install -D @types/better-sqlite3 drizzle-kit
```

- [ ] **Step 2: Define schema (chỉ cột auth P0 cần + IsActive)**

```ts
// lib/schema/users.ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("Users", {
  id: integer("Id").primaryKey({ autoIncrement: true }),
  name: text("Name").notNull(),
  username: text("Username"),
  passwordHash: text("PasswordHash"),
  role: text("Role").notNull().default("User"),
  groupId: integer("GroupId"),
  isActive: integer("IsActive", { mode: "boolean" }).notNull().default(true),
  createdAt: text("CreatedAt").notNull(),
});

export type User = typeof users.$inferSelect;
```

- [ ] **Step 3: `lib/db.ts`**

```ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema/users";

const path = process.env.ANTRUA_SQLITE_PATH;
if (!path) throw new Error("ANTRUA_SQLITE_PATH is required");

const sqlite = new Database(path);
export const db = drizzle(sqlite, { schema: { users: schema.users } });
```

- [ ] **Step 4: Dev seed DB script (chỉ khi chưa có DB cũ)**

Tạo `scripts/seed-dev-db.mjs` tạo bảng `Users` tối thiểu + user:

- Username: `ngotiendat`
- Password: `123456` (bcrypt hash rounds 12)
- Role: `SuperAdmin`, GroupId null, IsActive 1

Hoặc trỏ `ANTRUA_SQLITE_PATH` tới file DB production/dev cũ nếu có trên máy.

- [ ] **Step 5: Smoke query** (node/tsx hoặc test): `select` user by username returns row.

- [ ] **Step 6: Commit**

```bash
git add lib data scripts package.json package-lock.json .env.example
git commit -m "feat: add Drizzle Users mapping and SQLite client"
```

---

### Task 6: Password helper (BCrypt + MD5 legacy) — TDD

**Files:**
- Create: `lib/password.ts`
- Test: `tests/password.test.ts`

**Interfaces:**
- Consumes: `bcryptjs`, Node `crypto`
- Produces:
  - `hashPassword(plain: string): Promise<string>`
  - `verifyPassword(plain: string, hash: string | null | undefined): Promise<boolean>`

- [ ] **Step 1: Install**

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

- [ ] **Step 2: Write failing tests**

```ts
import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { hashPassword, verifyPassword } from "../lib/password";

describe("verifyPassword", () => {
  it("accepts bcrypt hash", async () => {
    const hash = await hashPassword("123456");
    expect(await verifyPassword("123456", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("accepts legacy MD5 hex 32", async () => {
    const md5 = createHash("md5").update("123456", "utf8").digest("hex");
    expect(md5).toHaveLength(32);
    expect(await verifyPassword("123456", md5)).toBe(true);
    expect(await verifyPassword("nope", md5)).toBe(false);
  });

  it("rejects null/empty hash", async () => {
    expect(await verifyPassword("123456", null)).toBe(false);
    expect(await verifyPassword("123456", "")).toBe(false);
  });
});
```

- [ ] **Step 3: Run tests — expect FAIL**

```bash
npm test -- tests/password.test.ts
```

- [ ] **Step 4: Implement `lib/password.ts`**

```ts
import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

function isMd5Hex(hash: string): boolean {
  return hash.length === 32 && /^[0-9a-fA-F]{32}$/.test(hash);
}

export async function verifyPassword(
  plain: string,
  hash: string | null | undefined,
): Promise<boolean> {
  if (!hash) return false;
  if (isMd5Hex(hash)) {
    const md5 = createHash("md5").update(plain, "utf8").digest("hex");
    return md5.toLowerCase() === hash.toLowerCase();
  }
  return bcrypt.compare(plain, hash);
}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
npm test -- tests/password.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add lib/password.ts tests/password.test.ts package.json package-lock.json
git commit -m "feat: port password verify (bcrypt + md5 legacy)"
```

---

### Task 7: Session + requireUser

**Files:**
- Create: `lib/session.ts`, `lib/auth.ts`
- Create: `app/api/auth/login/route.ts`, `app/api/auth/logout/route.ts`
- Test: `tests/session-shape.test.ts` (type/shape unit — optional pure helpers)

**Interfaces:**
- Consumes: iron-session, `db`, `users`, `verifyPassword`
- Produces:
  - Session fields: `userId`, `username`, `fullName`, `role`, `groupId` (number | null)
  - `getSessionUser(): Promise<SessionUser | null>`
  - `requireUser(): Promise<SessionUser>` (redirect `/login` nếu null)
  - `POST /api/auth/login` `{ username, password, remember? }`
  - `POST /api/auth/logout`

- [ ] **Step 1: Install iron-session**

```bash
npm install iron-session
```

- [ ] **Step 2: `lib/session.ts`**

```ts
import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  userId?: number;
  username?: string;
  fullName?: string;
  role?: string;
  groupId?: number | null;
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: ".AnTrua.Session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
```

- [ ] **Step 3: Login route — tìm user `Username` + `IsActive`, verify password, set session; 401 nếu sai.**

- [ ] **Step 4: `requireUser` trong `lib/auth.ts` dùng `redirect("/login")` từ `next/navigation`.**

- [ ] **Step 5: Manual — POST login với seed user trả Set-Cookie; logout clear.

- [ ] **Step 6: Commit**

```bash
git add lib/session.ts lib/auth.ts app/api/auth
git commit -m "feat: add session cookie auth login and logout"
```

---

### Task 8: Login page UI + protect shell routes

**Files:**
- Create: `app/login/page.tsx`, `components/login-form.tsx` (`"use client"`)
- Modify: `app/page.tsx`, `app/expenses/page.tsx`, `app/payments/page.tsx`, `app/reports/page.tsx` — gọi `requireUser()`
- Create: `components/logout-button.tsx`
- Modify: `components/app-shell.tsx` — hiện `fullName` + logout trong sheet “Thêm”

**Interfaces:**
- Consumes: `/api/auth/login`, `requireUser`
- Produces: form label-above-input; error dưới field; redirect `/` khi OK

- [ ] **Step 1: `LoginForm` — fields Username + Password + Remember checkbox (Remember: set cookie maxAge đã có trên session; P0 có thể chỉ toggle session cookie age — không bắt buộc port RememberMeToken đầy đủ).**

States:
- Loading: disable submit + label “Đang đăng nhập…”
- Error: `role="alert"` dưới form (“Sai tên đăng nhập hoặc mật khẩu”)
- Press: `active:scale-[0.98]` trên button

- [ ] **Step 2: `app/login/page.tsx` — nếu đã có session → redirect `/`.** Layout login **không** bọc AppShell (centered card trên nền workspace — asymmetric OK: card lệch trái trên desktop `md:ml-[10vw]`).

- [ ] **Step 3: Protect pages với `await requireUser()` đầu server component.**

- [ ] **Step 4: E2E tay**

1. Mở `/` → redirect `/login`
2. Sai password → lỗi inline
3. `ngotiendat` / `123456` → `/` + shell
4. Mobile bottom nav hoạt động
5. Logout → `/login`

- [ ] **Step 5: Commit**

```bash
git add app components
git commit -m "feat: add login UI and protect app shell routes"
```

---

### Task 9: P0 acceptance checklist + README

**Files:**
- Create: `README.md`
- Modify: spec status note optional

- [ ] **Step 1: README — cách chạy**

```md
# AnTrua

## Dev
cp .env.example .env.local
# set ANTRUA_SQLITE_PATH + SESSION_PASSWORD
npm install
npm run dev
```

- [ ] **Step 2: Run full test + build**

```bash
npm test
npm run build
```

Expected: PASS / build success.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add AnTrua P0 README and verify build"
```

---

## P0 Done criteria (từ spec)

- [x] Theme Attio tokens + Geist  
- [x] Shell sidebar + bottom nav responsive  
- [x] Login/session đọc Users từ SQLite  
- [x] Password bcrypt + MD5 legacy  
- [x] Protected home + placeholder routes  

**Không** yêu cầu P0: expenses CRUD, debt numbers, reports, integrations.

---

## Self-review (plan vs spec)

| Spec P0 item | Task |
|--------------|------|
| Repo Next + TS + Tailwind | T1 |
| Theme Attio + shadcn | T2–T3 |
| Shell sidebar + bottom nav | T4 |
| Auth session | T7–T8 |
| Gắn DB read smoke | T5–T8 |
| Anti Inter / emoji / h-screen | T2, T4, T8 |
| Drizzle ORM | T5 |

Placeholders: none intentional beyond stub pages “Sắp có” (in-scope P0).  
ORM/password/session names consistent across tasks.

---

## Sau P0

Viết plan `2026-09-10-antrua-p1-expenses.md` (CRUD + split) — không bắt đầu P1 trong plan này.
