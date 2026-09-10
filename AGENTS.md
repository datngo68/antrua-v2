# AGENTS.md — Hướng dẫn cho AI agent

File này giúp AI agent hiểu và vận hành dự án **AnTrua (QLTD v2)** từ A đến Z. Đọc file này **trước** khi làm bất cứ việc gì với repo.

> Người dùng mới chỉ cần nói "chạy dự án" / "setup" / "bắt đầu P0" → agent đọc file này + skill `.agent/skills/run-dev/SKILL.md` (hoặc plan P0) rồi thực hiện, không hỏi lại từng bước (trừ khi thiếu path DB / secret).

---

## Dự án là gì

**AnTrua** = rewrite UI/UX + stack của **Quản Lý Ăn Trưa (QLTD)**: chi tiêu theo nhóm, công nợ FIFO + netting, thanh toán tháng, báo cáo công khai, tích hợp (Telegram / Casso / APIBank / AI) theo phase.

| Kênh | Route / bề mặt | Vai trò |
|------|----------------|---------|
| Web app (auth) | `/`, `/expenses`, `/payments`, `/reports`, `/group`, `/settings` | User / Admin / SuperAdmin |
| Login | `/login` | Session cookie |
| Public report | `/reports/share/[token]` | Không auth |
| Webhooks (phase P6) | `/api/webhooks/*` | Casso / APIBank / Telegram |

**Nguồn sự thật nghiệp vụ / schema:** `doc-rebuild/` (giữ SQLite cũ).  
**Nguồn visual:** `Design.md` + `design-system/MASTER.md` (Attio teal).  
**Spec đã duyệt:** `docs/superpowers/specs/2026-09-10-antrua-ui-rebuild-design.md`.  
**Plan P0:** `docs/superpowers/plans/2026-09-10-antrua-p0-foundation.md`.

> Trạng thái repo: đang ở giai đoạn docs + agent env. App Next.js có thể **chưa scaffold** — khi đó "chạy dự án" = làm theo plan P0 trước, không bịa architecture lệch spec.

---

## Tech & cấu trúc (mục tiêu)

- **App:** Next.js App Router + TypeScript + Tailwind + shadcn/ui (token Attio).
- **ORM:** Drizzle → SQLite file cũ (`ANTRUA_SQLITE_PATH`).
- **Auth:** Session cookie (iron-session hoặc tương đương) — semantics `UserId`, `Username`, `FullName`, `Role`, `GroupId`.
- **Password:** BCrypt rounds 12 + MD5 hex 32 legacy.
- **Icons:** `@phosphor-icons/react` hoặc Radix icons — **không emoji**.
- **Font:** Geist (hoặc Satoshi) — **không Inter** (override có chủ đích so với `Design.md`).
- **Test:** Vitest cho logic tiền/nợ/password.

Thư mục mục tiêu (sau P0):

```
app/                 # routes
components/          # ui + shell
components/ui/       # shadcn only (ưu tiên)
lib/                 # db, schema, auth, password, debt helpers
design-system/       # MASTER tokens
doc-rebuild/         # domain/schema nguồn
docs/superpowers/    # specs + plans
.agent/skills/       # skill trong repo
.cursor/rules/       # Cursor rules
scripts/             # check UI conventions
```

---

## Lệnh chuẩn (sau khi có package.json)

| Lệnh | Tác dụng |
|------|----------|
| `npm install` | Cài deps |
| `npm run dev` | Next.js local |
| `npm run build` | Production build |
| `npm test` | Vitest |
| `npm run check:ui` | Chặn gradient / emoji icon / Inter import (khi script đã có) |
| `node scripts/seed-dev-db.mjs` | Seed DB dev (nếu chưa gắn DB cũ) |

Env: copy `.env.example` → `.env.local` (gitignored).

| Biến | Ý nghĩa |
|------|---------|
| `ANTRUA_SQLITE_PATH` | Path file SQLite (DB cũ hoặc seed) |
| `SESSION_PASSWORD` | ≥32 ký tự cho iron-session |

---

## Bảng skill — khi nào dùng skill nào

Agent **phải** đọc skill tương ứng trước khi làm việc thuộc phạm vi đó.

### 1. Skill trong repo (ưu tiên cao nhất)

| Skill | Đường dẫn | Kích hoạt khi |
|-------|-----------|----------------|
| **Run & Dev** | `.agent/skills/run-dev/SKILL.md` | "chạy dự án", "run local", "setup", "dev server", "seed db" |

### 2. Spec / plan trong repo

| Tài liệu | Khi nào |
|----------|---------|
| `docs/superpowers/specs/2026-09-10-antrua-ui-rebuild-design.md` | Mọi quyết định UI/stack — không tự đổi |
| `docs/superpowers/plans/2026-09-10-antrua-p0-foundation.md` | Scaffold / auth / shell — làm task-by-task |
| `doc-rebuild/*.md` | Schema, nợ, auth, dashboard formulas |
| `design-system/MASTER.md` | Token màu / type / spacing trước khi viết UI |

### 3. Superpowers — quy trình làm việc

| Giai đoạn | Skill | Khi nào |
|-----------|-------|---------|
| 1. Làm rõ ý tưởng | `brainstorming` | Feature mới, đổi UX/nav, thêm module |
| 2. Lập kế hoạch | `writing-plans` | Task multi-step (schema + UI + test) |
| 3. Thực thi plan | `executing-plans` / `subagent-driven-development` | Đã có plan |
| 4. Viết code đúng | `test-driven-development` | Password, split, FIFO/netting, payment status |
| 5. Gặp lỗi | `systematic-debugging` | Lệch số nợ, session, SQLite |
| 6. Trước khi báo xong | `verification-before-completion` | `npm test` / `build` / checklist |
| 7. Sau feature lớn | `requesting-code-review` | Debt engine, auth, multi-tenant |
| 8. Kết thúc nhánh | `finishing-a-development-branch` | Merge / PR |

### 4. UI / UX (bắt buộc khi đụng giao diện)

| Skill | Đường dẫn | Kích hoạt khi |
|-------|-----------|----------------|
| **Design taste frontend v1** | `~/.agents/skills/design-taste-frontend-v1/SKILL.md` | Layout, motion, anti-slop (dial mặc định 8/6/4) |
| **UI/UX Pro Max** | `~/.agents/skills/ui-ux-pro-max/SKILL.md` | Dashboard, form, table, a11y, responsive |
| **UI Styling** | `~/.agents/skills/ui-styling/SKILL.md` | Tailwind/shadcn component polish |
| **Redesign existing** | `~/.agents/skills/redesign-existing-projects/SKILL.md` | Audit UI generic / nâng cấp màn cũ |
| **Minimalist UI** | `~/.agents/skills/minimalist-ui/SKILL.md` | Khi cần flat/clean bổ sung (không đè Attio brand) |

**Quy ước UI project ghi đè skill generic nếu xung đột** — xem mục [Quy ước UI](#quy-ước-uistyle-bắt-buộc) và `.cursor/rules/antrua-ui-attio.mdc`.

### 5. GitNexus (khi repo đã index)

Dùng MCP `plugin-gitnexus-gitnexus` khi: hiểu luồng, impact trước sửa, debug call chain, refactor/rename, review PR. Nếu chưa index → `npx gitnexus analyze` tại root khi cần.

| Task | Skill | Tool chính |
|------|-------|------------|
| "X hoạt động thế nào?" | `gitnexus-exploring` | `query`, `context` |
| "Sửa X vỡ gì?" | `gitnexus-impact-analysis` | `impact`, `detect_changes` |
| Bug theo call chain | `gitnexus-debugging` | `query` → `trace` |
| Rename / refactor | `gitnexus-refactoring` | `impact` → `rename` |

**Money-path (nợ / thanh toán):** luôn `impact` + test số — GitNexus không thay fixture DB.

### 6. An toàn & review

| Skill | Khi nào |
|-------|---------|
| `review-security` | Auth, session, webhook, secret, public token |
| `review-bugbot` | User yêu cầu Bugbot review |

### 7. Ma trận “user nói X → skill”

| User nói | Kích hoạt |
|----------|-----------|
| Chạy local / setup | `run-dev` |
| Bắt đầu P0 / scaffold | Plan P0 + `executing-plans` hoặc subagent-driven |
| Feature mới | `brainstorming` → `writing-plans` → TDD → verify |
| Lệch số nợ / payment | `doc-rebuild/05` + `09` + TDD + `systematic-debugging` |
| Sửa / làm UI | `design-system/MASTER` + `design-taste-frontend-v1` + `ui-ux-pro-max` + rule Attio |
| Review bảo mật | `review-security` |
| Xong feature | `verification-before-completion` |

---

## Quy tắc khi vận hành (BẮT BUỘC)

1. **Đọc AGENTS.md → chọn skill → đọc skill → mới code/chạy lệnh.**
2. **Không đổi schema SQLite** (tên bảng/cột/PK/FK/null semantics) ở lần gắn DB đầu — xem `doc-rebuild/README.md`.
3. **Lệch số nợ so với app cũ = bug** — acceptance theo `doc-rebuild/09-invariants-checklist.md`.
4. **Multi-tenant:** mọi query Admin/User filter `GroupId` session; SuperAdmin optional `groupId`.
5. **Progress realtime:** lệnh lâu (dev, build, test) → background + đọc log; không `\| tail` im lặng.
6. **Secrets:** không bịa `SESSION_PASSWORD` / API key; không echo secret ra chat/log response.
7. **Không mở rộng scope:** không “tiện tay” làm P1 khi đang P0; không redesign schema.
8. **CẤM emoji do agent tự thêm** vào code, UI copy, comment, README, commit message. Icon = Phosphor/Radix/SVG. Ngoại lệ: user yêu cầu rõ hoặc dữ liệu user nhập.
9. **Conventional commits:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.
10. **Verify trước khi claim done:** `npm test` và/hoặc `npm run build` + `npm run check:ui` (khi có).

---

## Quy ước UI/Style (BẮT BUỘC)

Chi tiết token: `design-system/MASTER.md` + `Design.md`. Rule Cursor: `.cursor/rules/antrua-ui-attio.mdc`.

### Brand & màu

| Token | Hex | Dùng cho |
|-------|-----|----------|
| Brand / primary | `#3ABDAF` | Button primary, focus, highlight |
| Foreground | `#1C1D1F` | Text chính |
| Muted | `#666666` | Text phụ |
| Border | `#EBECF0` | 1px borders |
| Workspace bg | `#F4F5F7` | Nền app (không phải card) |
| Card | `#FFFFFF` | Surface |
| Secondary green | `#8BC269` | Accent phụ / success nhẹ |
| Destructive / nợ | `#DC2626` | Chỉ nợ âm, xóa, lỗi — **không** làm brand |

- **Cấm:** purple/violet AI default, neon glow, gradient chữ lớn, `#000000` pure black.
- **Cấm:** Inter làm font chính; dùng Geist/Satoshi.
- Dark mode (P7): theo block `dark` trong `Design.md`.

### Layout & nav

- Desktop: **sidebar**; Mobile: **bottom nav ≤5** (Tổng quan, Chi phí, Nợ, Báo cáo, Thêm).
- Content: `max-w-[1400px]`; mobile `px-4`; main có `pb-20` khi có bottom nav.
- Full height: `min-h-[100dvh]` — **cấm** `h-screen` cho hero/shell.
- Dashboard: Bento asymmetric — **cấm** hàng 3 card bằng nhau generic.
- Tables: spreadsheet Attio (1px border, header contrast).

### Components

- Ưu tiên **shadcn/ui** đã map token — hạn chế invent component mới.
- Form: label **trên** input; error **dưới** field; helper optional.
- States bắt buộc: skeleton loading, empty, error inline, press `active:scale-[0.98]`.
- Số tiền VND: `tabular-nums` / mono.
- Status pills: `Pending` | `Confirmed`.
- Motion: 150–300ms; tôn trọng `prefers-reduced-motion`; animate `transform`/`opacity` only.
- Dial mặc định: variance **8**, motion **6**, density **4** (Admin tables dày hơn).

### Check tự động

```bash
npm run check:ui
# hoặc: node scripts/check-ui-conventions.mjs
```

Script fail nếu phát hiện: `from "lucide-react"` (nếu project cấm), emoji trong TSX string đáng ngờ, `bg-gradient-to-`, import Inter font, class `h-screen` trên layout chính (heuristic).

---

## Lưu ý nghiệp vụ quan trọng

- **Roles:** `SuperAdmin` | `Admin` | `User` (string trong DB).
- **Split:** `ExpenseParticipant.Amount == null` = chia đều / phần còn lại — không “normalize” thành 0.
- **Debt:** FIFO + netting — port từ `doc-rebuild/05-debt-payments.md`; không bịa công thức.
- **Dashboard vs Report:** Dashboard hiện có thể cộng Pending; Report chỉ Confirmed — ghi chú product trước khi “sửa cho khớp”.
- **PublicView:** token share; không lộ data ngoài phạm vi token.
- **Integrations (P6):** feature flag; tắt được nếu chưa port.
- **Password legacy:** hash length 32 + hex → MD5; else BCrypt.

---

## Phase roadmap (đừng nhảy cóc)

| Phase | Nội dung |
|-------|----------|
| P0 | Foundation: Next + theme + shell + login + SQLite read |
| P1 | Expenses CRUD + split |
| P2 | Debt engine (số khớp fixture) |
| P3 | Dashboard |
| P4 | Reports + PublicView |
| P5 | Group / members |
| P6 | Integrations |
| P7 | Export / a11y / dark |

---

## File tham chiếu nhanh

| File | Nội dung |
|------|----------|
| `AGENTS.md` | File này |
| `Design.md` | Attio raw tokens |
| `design-system/MASTER.md` | Design system AnTrua (source of truth UI) |
| `doc-rebuild/README.md` | Entry domain/schema |
| `docs/superpowers/specs/…-design.md` | Spec UI/stack đã duyệt |
| `docs/superpowers/plans/…-p0-….md` | Plan triển khai P0 |
| `.agent/skills/run-dev/SKILL.md` | Chạy / setup local |
| `.cursor/rules/*.mdc` | Rules Cursor bắt buộc |
| `.env.example` | Env mẫu |

---

## Nguyên tắc làm việc của agent trên repo này

1. Đọc `AGENTS.md` → skill đúng bảng → đọc skill/spec → mới code.
2. UI: đọc `design-system/MASTER.md` + rule Attio trước; không copy shadcn violet default.
3. Đụng nợ/thanh toán: đọc `doc-rebuild/05` + `09`; viết test số trước khi “xong”.
4. Không mở rộng scope phase; không đổi UX nav đã chốt (sidebar + bottom nav).
5. Báo cáo ngắn bằng **tiếng Việt**; commit conventional; không emoji trong commit.
