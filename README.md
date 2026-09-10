# AnTrua (QLTD v2)

Rewrite UI/UX **Quản Lý Ăn Trưa** — Next.js + Attio/shadcn + Drizzle + SQLite cũ.

## Cho người & AI

| File | Việc |
|------|------|
| [`AGENTS.md`](./AGENTS.md) | **Đọc trước** — skill, UI rules, nghiệp vụ, phase |
| [`design-system/MASTER.md`](./design-system/MASTER.md) | Token & pattern UI |
| [`Design.md`](./Design.md) | Attio raw |
| [`doc-rebuild/`](./doc-rebuild/) | Schema + công thức nợ |
| [`docs/superpowers/specs/`](./docs/superpowers/specs/) | Spec đã duyệt |
| [`docs/superpowers/plans/`](./docs/superpowers/plans/) | Plan P0 |

## Setup nhanh

```bash
cp .env.example .env.local
# điền ANTRUA_SQLITE_PATH + SESSION_PASSWORD
```

Khi đã có app (sau P0):

```bash
npm install
npm run dev
node scripts/check-ui-conventions.mjs
```

Chưa scaffold? Nói với agent: **"chạy dự án"** hoặc **"bắt đầu P0"** — xem `.agent/skills/run-dev/SKILL.md`.

## Check UI (không cần Next)

```bash
node scripts/check-ui-conventions.mjs
```

Hiện OK nếu chưa có `app/` / `components/` (không có file để scan).
