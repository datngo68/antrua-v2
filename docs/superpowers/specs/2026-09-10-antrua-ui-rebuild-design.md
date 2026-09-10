# AnTrua (QLTD v2) — Design: UI/UX rebuild + stack

**Ngày:** 2026-09-10  
**Trạng thái:** Approved (user 2026-09-10)  
**Nguồn domain/schema:** `doc-rebuild/` (giữ SQLite + công thức nợ)  
**Nguồn visual:** `Design.md` (Attio tokens)

---

## 1. Mục tiêu

Rebuild giao diện và trải nghiệm **Quản Lý Ăn Trưa** thành sản phẩm web hoàn chỉnh, dài hạn, chia phase nhỏ ship được.

- **UX:** Cân bằng — mobile tốt cho User hàng ngày; desktop mạnh cho Admin/SuperAdmin.
- **UI:** Bám Attio (`Design.md`) + shadcn/ui đã themed; hạn chế component tự sáng tác.
- **Data:** Không đổi tên bảng/cột/PK/FK; port đúng FIFO + netting + MonthlyPayment (lệch số = lỗi).
- **Kiến trúc:** Next.js App Router full-stack (một repo).

**Không nằm trong scope thiết kế này:** redesign schema, thay đổi ý nghĩa nghiệp vụ nợ/thanh toán.

---

## 2. Quyết định đã chốt

| Hạng mục | Quyết định |
|----------|------------|
| Mục tiêu UX | Balanced mobile + desktop |
| Frontend | Next.js + React + Tailwind + TypeScript |
| Component | shadcn/ui map token Attio |
| Visual | Attio teal `#3ABDAF`, hunter `#1C1D1F`, border `#EBECF0`, radius 6–12px |
| Mobile nav | **Bottom navigation** cố định (≤5 mục) |
| Desktop nav | Sidebar |
| Kiến trúc | Next.js full-stack + gắn SQLite cũ |
| ORM (đề xuất mặc định) | **Drizzle** (SQL rõ, dễ bám quirks schema) |
| Auth | Session cookie (semantics `SessionHelper` cũ) |
| Dial | Variance 8 · Motion 6 · Density 4 (Admin tables dày hơn) |

---

## 3. Hướng giao diện (UI direction)

### 3.1 Personality

“Modern CRM nhẹ” kiểu Attio: sạch, relational clarity, teal sống động, không purple/neon, không card-slop 3 cột bằng nhau.

- Nền workspace: `#F4F5F7` (subtle layering).
- Surface: trắng + border 1px `#EBECF0`.
- Primary / focus / CTA chính: `#3ABDAF`.
- Text: `#1C1D1F`; muted `#666666`.
- Nợ / destructive: đỏ semantic (ví dụ `#DC2626`) — **chỉ** cho nợ âm / xóa / lỗi; không dùng làm brand.
- Dark mode (phase sau): theo block `dark` trong `Design.md`.

### 3.2 Typography & số

- Sans: **Geist** hoặc **Satoshi** (tránh Inter mặc định AI-slop; `Design.md` ghi Inter — override có chủ đích cho premium + anti-slop).
- Mono/tabular: số tiền VND (`font-variant-numeric: tabular-nums` hoặc Geist Mono).
- Heading: semibold, `tracking-tight`; body ~14–16px, `leading-relaxed`.

### 3.3 Layout patterns

- **Desktop:** sidebar trái + main; max content `max-w-[1400px]`; grid asymmetric cho dashboard (Bento), không hero center.
- **Mobile (`< md`):** single column, `px-4`, **bottom nav** cố định; nội dung có `padding-bottom` đủ để không bị che.
- Full-height vùng chính: `min-h-[100dvh]` — **không** `h-screen`.
- Tables (chi phí / nợ): kiểu spreadsheet Attio — header contrast, 1px border, row hover nhẹ.
- Status: soft pills (`Pending` | `Confirmed`).

### 3.4 Motion

- Transition 150–300ms; spring nhẹ cho sheet/drawer.
- Stagger list khi mount (cascade CSS hoặc Framer trong Client leaf).
- Tôn trọng `prefers-reduced-motion`.
- Không custom cursor; không neon glow.

### 3.5 States bắt buộc

Mọi màn hình chính phải có: **skeleton loading**, **empty**, **error inline** (form), **press** `scale-[0.98]` / feedback rõ.

---

## 4. Information architecture

### 4.1 Desktop sidebar

1. Tổng quan  
2. Chi phí  
3. Công nợ & Thanh toán  
4. Báo cáo  
5. Nhóm & Thành viên (Admin+)  
6. Cài đặt  

### 4.2 Mobile bottom nav (≤5)

| Slot | Mục |
|------|-----|
| 1 | Tổng quan |
| 2 | Chi phí |
| 3 | Nợ |
| 4 | Báo cáo |
| 5 | Thêm → sheet (thành viên, cài đặt, đăng xuất) |

### 4.3 Routes

| Route | Ghi chú |
|-------|---------|
| `/login` | Anonymous |
| `/` | Dashboard |
| `/expenses` | List + filter |
| `/expenses` + sheet/drawer create (primary); `/expenses/new` optional deep link | Create |
| `/expenses/[id]` | Detail / edit |
| `/payments?year&month` | Deep link từ dashboard tháng |
| `/reports` | Báo cáo + quản lý share |
| `/reports/share/[token]` | PublicView, no auth |
| `/group` | Thành viên |
| `/settings` | Integrations (phase sau) |
| `/admin/groups` | SuperAdmin |

### 4.4 Roles (UI + data filter)

Giữ semantics `doc-rebuild/03-auth-tenancy.md`:

- **User:** data theo `GroupId`; sửa/xóa expense khi là Payer.
- **Admin:** CRUD trong group; confirm payment nhóm.
- **SuperAdmin:** mọi group; filter optional `groupId`.

---

## 5. Màn hình & flow chính

1. **Login** — username/password, remember-me; lỗi dưới field; verify BCrypt + MD5 legacy.
2. **Dashboard** — Bento KPI (`TotalExpenses`, `TotalTransactions`, top payer) + thống kê tuần/tháng; CTA thêm chi phí; deep link → payments. *Ghi chú product:* dashboard hiện không filter `Confirmed` như Report — phase P3 quyết định giữ parity hoặc khớp Report (document rõ cho user).
3. **Expenses** — list/filter; **create mặc định = sheet/drawer** (mobile full-height); split equal/custom/mixed theo `ExpenseParticipant.Amount` null semantics.
4. **Debts/Payments** — RemainingAmount, netting hiển thị đúng; tạo Pending; QR/CK; Confirm theo quyền.
5. **Reports + PublicView** — token share; public read-only.
6. **Group** — members (Admin+).
7. **Settings** — placeholder rồi lần lượt Telegram → Casso/APIBank → AI Vision.

---

## 6. Stack kỹ thuật

```
Next.js (App Router) + TypeScript
├── UI: Tailwind + shadcn/ui (tokens Attio) + Phosphor/Radix icons
├── Data UI: TanStack Query; TanStack Table khi cần grid dày
├── Motion: Framer Motion (client leaf only) | CSS transitions
├── ORM: Drizzle → SQLite file cũ (connection string tương đương appsettings)
├── Mutate/Read: Server Actions + Route Handlers
├── Auth: session cookie (port idle 30d semantics)
└── Exports: PDF / Excel / QR — phase P7 (parity thư viện cũ)
```

**Nguyên tắc port logic:** công thức trong `doc-rebuild/05-debt-payments.md` + checklist `09-invariants-checklist.md` là acceptance tests bắt buộc trước khi coi P2 xong.

**Integrations** (`08-integrations.md`): contract sẵn; tắt feature flag đến đúng phase.

---

## 7. Roadmap phase (việc nhỏ, dài hạn)

Mỗi phase = MR/ship nhỏ, có tiêu chí “xong”.

| Phase | Nội dung | Done when |
|-------|----------|-----------|
| **P0** Foundation | Repo Next, theme Attio+shadcn, shell sidebar + bottom nav, login/session, đọc DB smoke | Login được user seed; shell responsive |
| **P1** Expenses | List/create/edit/split/dishes cơ bản + quyền | CRUD đúng group; split equal/custom/mixed |
| **P2** Debt engine | FIFO + netting + MonthlyPayment Pending/Confirmed | Số khớp app cũ trên cùng DB fixture |
| **P3** Dashboard | KPI + tuần/tháng + deep link | Số khớp quyết định parity đã document |
| **P4** Reports | Report tháng + PublicView token | Link public mở đúng phạm vi |
| **P5** Group | Members Admin+ | Admin quản user trong group |
| **P6** Integrations | Telegram → Casso/APIBank → AI (từng MR) | Webhook/notify hoạt động từng phần |
| **P7** Polish | PDF/Excel/QR, a11y, dark mode | Parity export + WCAG AA cơ bản |

---

## 8. Anti-patterns (cấm)

- Đổi schema “cho đẹp” ở lần gắn DB đầu.
- shadcn default tím / Inter-only stock look không map token.
- Emoji làm icon; Unsplash; tên giả Jane Doe / Acme.
- `h-screen` hero; 3 cột card feature hàng ngang generic.
- Neon glow; custom cursor; animate `top/left/width/height`.
- Bottom nav > 5 mục; dựa hover-only trên mobile.

---

## 9. Rủi ro & giả định

| Rủi ro | Giảm thiểu |
|--------|------------|
| Lệch số nợ vs app cũ | Fixture DB + checklist 09 trước merge P2 |
| Schema quirks (null Amount, non-unique…) | Drizzle map đúng null; không thêm unique sớm |
| Scope integrations | Feature flag; P6 tách MR |
| Attio Inter vs anti-Inter skill | Dùng Geist/Satoshi; ghi rõ trong theme |

**Giả định:** file SQLite runtime vẫn là nguồn sự thật; rewrite đọc/ghi cùng schema. Team ưu tiên một codebase TypeScript full-stack.

---

## 10. Tiếp theo sau khi spec được duyệt

1. Skill **writing-plans** → plan triển khai P0 chi tiết (task + verify).  
2. Không scaffold UI cho đến khi plan P0 được duyệt (trừ khi user yêu cầu khác).

---

## Phụ lục — Tham chiếu

- `doc-rebuild/README.md` … `09-invariants-checklist.md`
- `Design.md` (Attio tokens)
- Dial skill: design-taste-frontend-v1 (8 / 6 / 4)
- ui-ux-pro-max: Bento + teal finance palette (đã chỉnh theo Attio brand)
