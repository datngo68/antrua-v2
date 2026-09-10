# Tài liệu rebuild — Quản Lý Ăn Trưa (QLTD)

Bộ tài liệu này mô tả **schema SQLite hiện tại** và **logic nghiệp vụ** của app ASP.NET Core MVC đang chạy, đủ để viết lại ứng dụng trên stack khác **mà vẫn gắn lại file DB / dữ liệu cũ**.

> Tiếng Việt. Body kỹ thuật trung lập. Không redesign UI trong bộ này.

## Vị trí bộ tài liệu (cho project rewrite tham chiếu)

| Kiểu | Đường dẫn |
|------|-----------|
| Absolute (máy này) | `F:/QuanLyAnTrua/docs/rebuild/` |
| Relative trong repo gốc | `docs/rebuild/` |
| Repo gốc | `F:/QuanLyAnTrua` (git: QuanLyAnTrua) |
| Entry point | `F:/QuanLyAnTrua/docs/rebuild/README.md` |

Trong repo rewrite, ghi chú tham chiếu ví dụ:

```md
## Domain / schema nguồn
Tham chiếu bộ docs rebuild QLTD (giữ DB cũ):
- Absolute: F:/QuanLyAnTrua/docs/rebuild/
- Relative (nếu clone cạnh nhau): ../QuanLyAnTrua/docs/rebuild/
Đọc bắt đầu: README.md → 02-database-schema.md → 05-debt-payments.md → 09-invariants-checklist.md
```

File DB SQLite runtime thường nằm dưới project web (xem `ConnectionStrings:DefaultConnection` trong `QuanLyAnTrua/appsettings*.json`), ví dụ dev: `QuanLyAnTrua/QuanLyAnTrua.db` — **không** nằm trong `docs/rebuild/`.

## Mục tiêu rewrite

- Giữ nguyên **tên bảng, cột, PK/FK, index, DeleteBehavior** như EF snapshot hiện tại.
- Port đúng **công thức nợ / thanh toán / chia chi phí** — lệch số so với app cũ = lỗi.
- Module phụ (Telegram, Casso, APIBank, AI, Parking, DishRatings) có contract để port dần; có thể tạm tắt nếu chưa cần.

## Nguyên tắc tương thích data cũ

1. **Không “chuẩn hóa” schema** trong lần gắn DB đầu (không unique Username, không NOT NULL `ExpenseParticipant.Amount`, không unique `(UserId, Year, Month)` trên MonthlyPayment).
2. **Null có nghĩa**: `ExpenseParticipant.Amount == null` = chia đều / phần còn lại; `User.GroupId == null` thường là SuperAdmin; `MonthlyPayment.CreditorId == null` = payment legacy.
3. **String status**, không enum DB: payment `Pending` | `Confirmed`; Apibank order `Pending` | `Paid` | `Expired` | `Cancelled`.
4. Password: BCrypt (rounds 12) **và** legacy MD5 hex 32 ký tự vẫn phải verify được.
5. Secrets: APIBank/AI key encrypted (DataProtection); `CassoWebhookSecret` trên User là plain text trong DB.

## Mục lục

| File | Nội dung |
|------|----------|
| [01-domain-overview.md](01-domain-overview.md) | Sản phẩm, multi-tenant, glossary |
| [02-database-schema.md](02-database-schema.md) | 10 bảng, quan hệ, quirks |
| [03-auth-tenancy.md](03-auth-tenancy.md) | Session, roles, password, filter GroupId |
| [04-expenses.md](04-expenses.md) | CRUD chi phí, split, dishes, quyền |
| [05-debt-payments.md](05-debt-payments.md) | Công thức nợ FIFO + netting + MonthlyPayment |
| [06-reports-public.md](06-reports-public.md) | SharedReport, PublicView, nội dung CK |
| [07-dashboard.md](07-dashboard.md) | Aggregates + lệch so với Report |
| [08-integrations.md](08-integrations.md) | Telegram, Casso, APIBank, AI, Parking, DishRatings |
| [09-invariants-checklist.md](09-invariants-checklist.md) | Checklist trước khi coi rewrite “đúng data” |

## Nguồn khảo sát (code cũ)

- `QuanLyAnTrua/Data/ApplicationDbContext.cs`
- `QuanLyAnTrua/Migrations/ApplicationDbContextModelSnapshot.cs`
- `QuanLyAnTrua/Models/*`
- `QuanLyAnTrua/Services/{Expense,Payment,Report,Group,SeedData,Apibank*,AiVision*}Service.cs`
- `QuanLyAnTrua/Helpers/{Debt,Session,Password,IdEncoder,Token,Telegram,Casso*,Apibank*}Helper.cs`
- Controllers: Account, Expenses, Payments, Reports, Home, CassoWebhook, ApibankWebhook, TelegramWebhook, ParkingPayment, DishRatings, AiAssist

## Stack hiện tại (tham chiếu, không bắt buộc giữ)

| Thành phần | Hiện tại |
|------------|----------|
| Runtime | .NET 8 + ASP.NET Core MVC |
| ORM | EF Core 9 + SQLite |
| Auth | Session cookie (không Identity/JWT) |
| Password | BCrypt.Net (+ MD5 legacy) |
| PDF / Excel / QR | QuestPDF, ClosedXML, QRCoder |

Rewrite có thể đổi stack; **schema + công thức** là phần bắt buộc giữ.

## Thứ tự đọc gợi ý

```
README → 01 → 02 → 03 → 04 → 05 → 06 → 09
         └→ 07 (dashboard)
         └→ 08 (khi port tích hợp)
```
