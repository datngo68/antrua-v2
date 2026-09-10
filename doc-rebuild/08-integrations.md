# 08 — Integrations

Contract để port module phụ. Có thể tắt từng phần khi rewrite; **không** đổi schema core vì các module này.

---

## 1. Telegram

**Nguồn:** `Helpers/TelegramHelper.cs`, `Controllers/TelegramWebhookController.cs`, `Controllers/SettingsController.cs`, notification services (`ExpenseNotificationService`, `DishRatingNotificationService`…).

### Config / secret

| Key | Nơi |
|-----|-----|
| `Telegram:BotToken` | appsettings / env |
| `Telegram:BotUsername` | appsettings |
| `User.TelegramUserId` | DB — chat id người nhận |

Webhook set/delete qua Settings + `TelegramHelper.SetWebhookAsync`.

### Trigger → side-effect

| Trigger | Hành vi |
|---------|---------|
| Tạo expense + checkbox gửi Telegram | Message nhắc nợ / link báo cáo (Group hoặc User link qua `ReportLinkService`) |
| Gửi link đánh giá món | Message có URL rating từng dish |
| User bấm inline button | `callback_query` |
| `confirm_payment_{paymentId}_{secretToken}` | Pending → Confirmed (nếu token khớp Notes/secret) |
| `reject_payment_{paymentId}_{secretToken}` | Xử lý reject Pending |
| Mini App | View `TelegramMiniApp` mở PublicView / flow thanh toán |

Không có bảng log tin nhắn. Idempotent confirm: check `Status == Confirmed` trước khi đổi.

### Port tối thiểu

1. Gửi message theo `TelegramUserId`
2. Webhook nhận update + verify (nếu có secret path)
3. Confirm/reject Pending cùng quyền nghiệp vụ Reports

---

## 2. Casso

**Nguồn:** `Controllers/CassoWebhookController.cs`, `Helpers/CassoWebhookHelper.cs`, `Helpers/IdEncoderHelper.cs`.

### Secret

1. Ưu tiên `User.CassoWebhookSecret` theo **số tài khoản** nhận tiền trên transaction
2. Fallback `Casso:WebhookSecret` / `Casso:SecureToken` trong config
3. Version webhook (`Casso:WebhookVersion`) — V1 secure token vs signature helper

Endpoint `[AllowAnonymous]` nhưng **bắt buộc** verify secret/token.

### Flow

```
Webhook payload
  → verify secret
  → ParsePaymentDescription(transaction.Description)
  → Ceiling(amount)
  → tạo / cập nhật MonthlyPayment (thường Confirmed)
  → optional Telegram notify
```

Parse CK: xem [06-reports-public.md](06-reports-public.md).  
Idempotent: tránh double-credit cùng transaction nếu đã có logic theo id/notes (đọc `ProcessTransaction` khi port).

---

## 3. APIBank

**Nguồn:** `Controllers/ApibankController.cs`, `Controllers/ApibankWebhookController.cs`, `Services/ApibankOrderService.cs`, `Services/ApibankOrderCleanupService.cs`, `Helpers/ApibankWebhookHelper.cs`, `Helpers/SecretProtector.cs`.

### Per-user config (bảng Users)

- `ApibankEnabled`, `ApibankBaseUrl`, `ApibankBankAccountId`
- `ApibankApiKeyEncrypted`, `ApibankWebhookSecretEncrypted` — DataProtection (`App_Data/DataProtection-Keys/`)

### Order (`ApibankPaymentOrders`)

- Tạo order: amount `Ceiling`, description = `CreatePaymentDescription(...)`
- Status: `Pending` → `Paid` | `Expired` | `Cancelled`
- Unique `ApibankCode`
- Hosted cleanup hết hạn (`ApibankOrderCleanupService`)

### Webhook

1. Resolve creditor (order_id / bank_account_id)
2. Verify webhook secret (unprotect)
3. Dedupe: INSERT `ApibankWebhookEvents` theo PK `EventId` (race → ignore)
4. Nếu order đã `Paid` → OK idempotent
5. Tạo `MonthlyPayment` `Status=Confirmed` + gắn `ApibankOrderId`/`ApibankCode`; set order `Paid`, `MonthlyPaymentId`
6. Optional Telegram notify

`MonthlyPaymentId` trên order: FK **SetNull** nếu xóa payment.

---

## 4. AI Vision

**Nguồn:** `Services/AiVisionService.cs`, `Controllers/AiAssistController.cs`, Create Expense modal.

### Config per-user

`AiEnabled`, `AiBaseUrl`, `AiApiKeyEncrypted`, `AiModel` trên `Users`.

HTTP client timeout dài (~120s). Không log raw API key.

### Flow

1. User upload ảnh hóa đơn trên Create Expense
2. Gọi API OpenAI-compatible vision
3. Parse JSON → gợi ý `Amount`, participants / chia tiền
4. User xác nhận trước khi POST create thật

Không có bảng lưu lịch sử AI.

---

## 5. DishRatings

**Nguồn:** models `Dish`/`DishRating`, `Controllers/DishRatingsController.cs`, `DishRatingNotificationService`.

- Unique `(DishId, UserId)`
- Rating 1–5; optional comment / image / video path
- Cascade khi xóa Dish/Expense
- Telegram gửi link đánh giá sau tạo expense (optional checkbox)

Public/anonymous rating link tùy action — khi port đọc controller để giữ đúng auth.

---

## 6. ParkingPayment

**Nguồn:** `Controllers/ParkingPaymentController.cs`, config `ParkingPayment:*`.

**Không dùng bảng QLTD.** Module độc lập:

| Config | Ý nghĩa |
|--------|---------|
| `ParkingPayment:Prices:Motorbike` | Giá xe máy / tháng |
| `ParkingPayment:Prices:Car` | Ô tô |
| `ParkingPayment:Prices:CarOvernight` | Ô tô qua đêm |
| `ParkingPayment:CompanyAccount:*` | TK công ty + QR |
| `ParkingPayment:StaffAccount:*` | TK nhân viên |

UI chọn loại xe / số tháng → tính tiền → QR + số TK. Có thể port riêng hoặc bỏ khỏi rewrite core.

---

## Bảng phụ thuộc nhanh

| Module | Đọc/ghi bảng |
|--------|----------------|
| Telegram | Users (TelegramUserId), MonthlyPayments, SharedReports |
| Casso | Users (secret, bank), MonthlyPayments |
| APIBank | Users (keys), ApibankPaymentOrders, ApibankWebhookEvents, MonthlyPayments |
| AI | Users (AI keys) — không ghi bảng expense cho đến khi user save |
| DishRatings | Dishes, DishRatings |
| Parking | — |
