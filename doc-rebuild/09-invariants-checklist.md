# 09 — Invariants checklist

Dùng trước khi coi rewrite “đúng data cũ”. Tick từng mục sau khi gắn SQLite production/dev cũ và chạy số liệu mẫu.

## Schema

- [ ] Đủ 10 bảng đúng tên PascalCase
- [ ] `ExpenseParticipants` PK `(ExpenseId, UserId)` — không cột `Id`
- [ ] `ExpenseParticipant.Amount` nullable; null = chia đều / phần còn lại
- [ ] `MonthlyPayments` index `(UserId, Year, Month)` **không** unique
- [ ] `MonthlyPayment.CreditorId` nullable
- [ ] `Username` / `PasswordHash` nullable; Username **không** unique DB
- [ ] `SharedReports` **không** có Year/Month; tháng = `CreatedAt`
- [ ] `ApibankWebhookEvents.EventId` string PK
- [ ] `ApibankPaymentOrders.ApibankCode` unique; `MonthlyPaymentId` SetNull
- [ ] Cascade chỉ: Expense→Participants, Expense→Dishes, Dish→DishRatings
- [ ] FK còn lại Restrict

## Auth / tenant

- [ ] Login BCrypt + legacy MD5 hex 32
- [ ] Session keys: UserId, Username, FullName, Role, GroupId
- [ ] SuperAdmin `GroupId` null; non-SA không group → query rỗng
- [ ] User chỉ sửa/xóa expense khi là Payer (cùng group)

## Expense / split

- [ ] Custom: tổng participant ±0.01 so với `Expense.Amount`
- [ ] Equal: mọi Amount null
- [ ] Mixed: null nhận `Round(remaining / n, 2)`
- [ ] Không tạo debt khi participant == payer
- [ ] Xóa expense cascade participant + dish (+ rating)

## Debt / payment

- [ ] Chỉ payment `Confirmed` trừ nợ trên Report / Payments Index
- [ ] Pending: `Ceiling(amount)`; soft unique Pending theo (User, Creditor, Year, Month)
- [ ] `CreditorId == null` → FIFO mọi debt của debtor
- [ ] ApplyPayments FIFO theo PaidDate → debt ExpenseDate, ExpenseId
- [ ] `NetMutualDebts` hai chiều + tolerance 0.01
- [ ] Payments Index = **nợ tích lũy** (PublicView formula), không monthly-only
- [ ] Một implementation debt duy nhất (không nhân đôi controller/service)

## Reports / CK

- [ ] PublicView: active + expiry; LastAccessedAt
- [ ] PublicView debt = all expenses + all Confirmed payments
- [ ] Monthly report = expenses + Confirmed **cùng** tháng
- [ ] `CreatePaymentDescription` / `ParsePaymentDescription` khớp Prefix/Suffix config; chịu bank strip ký tự

## Dashboard

- [ ] Đã quyết định: giữ hành vi cũ (Pending cũng cộng PaidAmount) **hoặc** align Confirmed — ghi rõ trong release notes

## Integrations (nếu bật)

- [ ] Casso: verify secret (user theo STK → fallback config); parse description; Ceiling; không double-credit
- [ ] APIBank: DataProtection keys; dedupe EventId; order Paid → MonthlyPayment Confirmed
- [ ] Telegram: confirm/reject Pending an toàn; không gửi nếu thiếu TelegramUserId
- [ ] AI: không log API key; user confirm trước khi tạo expense
- [ ] DishRatings: unique (DishId, UserId)
- [ ] Parking: config-only, không đụng bảng core

## Smoke số liệu (bắt buộc)

Chọn 1 group có data thật trên DB cũ:

1. So sánh **tổng chi tháng T** (Dashboard vs SQL `SUM(Amount)`)
2. So sánh **nợ còn lại user A → creditor B** trên Payments Index với app cũ (cùng năm/tháng filter UI)
3. Tạo 1 Pending → Confirm → Remaining giảm đúng Ceiling
4. PublicView token cũ vẫn mở đúng scope
5. Login user MD5 legacy (nếu còn) và user BCrypt

Nếu bước 2 lệch > 1 VND (ngoài tolerance 0.01 trên từng residual) → dừng và đối chiếu [05-debt-payments.md](05-debt-payments.md).

## Tham chiếu nhanh

| Chủ đề | File |
|--------|------|
| Bảng / quirks | [02-database-schema.md](02-database-schema.md) |
| Auth | [03-auth-tenancy.md](03-auth-tenancy.md) |
| Split | [04-expenses.md](04-expenses.md) |
| Nợ | [05-debt-payments.md](05-debt-payments.md) |
| Public / CK | [06-reports-public.md](06-reports-public.md) |
| Dashboard lệch | [07-dashboard.md](07-dashboard.md) |
| Webhook / bot | [08-integrations.md](08-integrations.md) |
