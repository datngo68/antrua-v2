# AnTrua

Rewrite UI/UX **Quản Lý Ăn Trưa (QLTD)** — Next.js + Attio/shadcn + Drizzle + SQLite cũ.

## Dev

```bash
cp .env.example .env.local
# ANTRUA_SQLITE_PATH + SESSION_PASSWORD (≥32 ký tự)

npm install
node scripts/seed-dev-db.mjs   # nếu chưa có DB cũ
npm run dev
```

Seed mặc định: `ngotiendat` / `123456` (SuperAdmin).

```bash
npm test
npm run build
npm run check:ui
npm run seed          # tạo data/antrua.dev.db nếu chưa có
```

## Tài liệu

| File | Việc |
|------|------|
| [`AGENTS.md`](./AGENTS.md) | Skill, UI rules, nghiệp vụ, phase |
| [`design-system/MASTER.md`](./design-system/MASTER.md) | Token & pattern UI |
| [`doc-rebuild/`](./doc-rebuild/) | Schema + công thức nợ |
| [`docs/superpowers/plans/`](./docs/superpowers/plans/) | Plan P0+ |

## Ghi chú môi trường

- Node **22.5.1**: pin `better-sqlite3@11` (v13 segfault trên bản Node này). Nâng Node ≥22.9 khuyến nghị.
- Không commit `.env.local` / `*.db`.
