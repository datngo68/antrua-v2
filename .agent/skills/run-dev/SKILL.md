---
name: run-dev-antrua
description: >-
  Chạy local / setup AnTrua (QLTD v2). Kích hoạt khi user nói "chạy dự án",
  "run local", "setup", "dev server", "seed db", "cài môi trường".
---

# Run & Dev — AnTrua

Skill hướng dẫn agent setup/chạy **end-to-end** theo phase hiện tại. Đọc `AGENTS.md` trước.

## Bối cảnh cố định

- **Mục tiêu stack:** Next.js App Router + Drizzle + SQLite + shadcn (Attio).
- **Env:** `.env.local` từ `.env.example` (`ANTRUA_SQLITE_PATH`, `SESSION_PASSWORD`).
- **Domain:** `doc-rebuild/`. **UI:** `design-system/MASTER.md`.
- **P0 plan:** `docs/superpowers/plans/2026-09-10-antrua-p0-foundation.md`.

## QUY TẮC BẮT BUỘC

1. **Progress realtime:** `npm run dev` / build / test → background + đọc log; không `\| tail` im lặng.
2. **Không bịa secret** — nếu thiếu `SESSION_PASSWORD` hoặc path DB → hỏi user / hướng dẫn copy `.env.example`.
3. **Chưa có `package.json`:** không bịa app lệch spec — chuyển Workflow S (scaffold P0) hoặc báo cần duyệt execute P0.
4. **Không deploy production** trong skill này (AnTrua P0 = local). Deploy = plan/phase sau + xác nhận user.
5. Sau thay đổi: `npm test` và/hoặc `npm run build` + `npm run check:ui` nếu script tồn tại.

---

## Workflow S — Chưa scaffold (repo chỉ docs)

Dùng khi không có `package.json` / `app/`.

1. Xác nhận với user: "Bắt đầu P0 theo plan?" (nếu chưa từng approve execute).
2. Đọc và làm theo `docs/superpowers/plans/2026-09-10-antrua-p0-foundation.md` task-by-task (TDD nơi có test).
3. Skills thực thi: `executing-plans` hoặc `subagent-driven-development`.
4. Khi `npm run dev` chạy được → chuyển Workflow A để verify.

---

## Workflow A — Chạy local (đã có Next app)

1. `npm install` nếu thiếu `node_modules`.
2. Nếu chưa có `.env.local` → copy `.env.example` → `.env.local`; đảm bảo:
   - `SESSION_PASSWORD` ≥ 32 ký tự
   - `ANTRUA_SQLITE_PATH` trỏ DB cũ hoặc file seed
3. Nếu chưa có DB: chạy `node scripts/seed-dev-db.mjs` (khi script đã có) — user seed `ngotiendat` / `123456` SuperAdmin (dev only).
4. Start: `npm run dev` (background). Đợi Ready.
5. Verify checklist:
   - [ ] `/login` mở được
   - [ ] Login seed → `/` + shell (sidebar desktop / bottom nav mobile)
   - [ ] `npm run check:ui` pass (nếu có)
6. Báo URL local cho user (thường `http://localhost:3000`).

---

## Workflow B — Máy mới / clone lần đầu

1. Node 20+ khuyến nghị: `node -v`.
2. `npm install`.
3. Copy env (Workflow A bước 2).
4. Gắn DB: path SQLite app cũ **hoặc** seed.
5. Nếu chưa scaffold → Workflow S rồi A; nếu đã có app → A.
6. (Tuỳ chọn) Index GitNexus: `npx gitnexus analyze` khi cần impact.

---

## Lỗi thường gặp

| Triệu chứng | Hướng xử lý |
|-------------|-------------|
| `ANTRUA_SQLITE_PATH is required` | Set trong `.env.local` |
| Login fail seed | Kiểm tra hash bcrypt / IsActive; chạy lại seed |
| Session không giữ | `SESSION_PASSWORD` thiếu/ngắn; cookie secure chỉ production |
| UI tím / Inter | Chưa map token Attio — xem `design-system/MASTER.md` + Task theme P0 |
| `check:ui` fail | Gỡ gradient / emoji / Inter / `h-screen` theo báo cáo script |

---

## Khi user nói "chạy dự án"

```
package.json tồn tại?
  không → Workflow S (hỏi confirm P0 nếu cần) → A
  có    → Workflow A
```
