# 04 — Expenses

Nguồn: `Services/ExpenseService.cs`, `Controllers/ExpensesController.cs`, models `Expense` / `ExpenseParticipant` / `Dish`.

## Entities liên quan

```
Expense
  ├── ExpenseParticipant[]  (cascade)
  └── Dish[]                (cascade) → DishRating[]
```

Fields chính: `Amount`, `PayerId`, `ExpenseDate`, `Description?`, `CreatedAt`, `GroupId?`.

Participant: PK `(ExpenseId, UserId)`, `Amount?`.

## Split semantics (persist + runtime)

| UI SplitType | Persist |
|--------------|---------|
| Equal (0) | Mọi `ExpenseParticipant.Amount = null` |
| Custom (1) | Mỗi participant `Amount > 0`; `\|Σ amounts − Expense.Amount\| ≤ 0.01` |

**Runtime share** (Report / Payment — hỗ trợ mixed trên cùng expense):

```
if participant.Amount.HasValue:
  share = participant.Amount.Value
else:
  remaining = Expense.Amount − Σ(participants where Amount.HasValue)
  n = count(participants where !Amount.HasValue)
  share = Round(remaining / n, 2)
```

Helper UI equal thuần (`CalculateParticipantAmountsAsync`): `Round(total / count, 2)` — **không** thay công thức mixed ở Report.

**Debt rule:** không tạo `DebtDetail` khi `participant.UserId == payerId` (payer có thể vẫn nằm trong list participants; share vẫn cộng vào `TotalAmount` summary của payer nhưng không nợ chính mình).

## Create

1. ≥ 1 `ParticipantIds`.
2. Custom: validate từng amount > 0 và tổng khớp ±0.01.
3. `GroupId`:
   - Non-SA → session `GroupId`
   - SA → query `groupId` hoặc fallback `payer.GroupId`
4. User role: `PayerId` **bắt buộc** = chính mình.
5. Lưu Expense + participants (Equal → null amounts / custom → số).
6. Dishes (optional): controller tạo `Dish` sau save; `DishImages[i]` upload theo index.
7. Optional: Telegram notify / gửi link đánh giá món (module phụ).

## Edit

- Cập nhật `Amount`, `PayerId`, `ExpenseDate`, `Description`.
- Diff participants: xóa người bỏ chọn; update/add `Amount` theo SplitType.
- Dishes: xóa theo tên không còn; update image / thêm mới (match theo `Name` trong bản hiện tại).
- Cùng quyền với delete (Admin cùng group / User là payer / SA).

## Delete

- Cùng quyền edit.
- `Expenses.Remove` → cascade Participants + Dishes (+ DishRatings).

## List / filter

`ExpensesController.Index`: filter optional `groupId` (SA), `month`, `year` qua `ExpenseService.GetExpensesAsync`.

Sort UI: nên `CreatedAt` / `Id` desc (bản ghi mới nhất trước). Sort chuỗi `dd/MM/yyyy` **sai** — dùng numeric order key.

## Permission matrix

| Action | SuperAdmin | Admin | User |
|--------|------------|-------|------|
| List group | all / filter | group mình | group mình |
| Create | yes (+ chọn group) | yes | yes, payer = self |
| Edit/Delete | yes | cùng group | cùng group + payer = self |

## Invariants

1. `Amount` participant null ≠ 0 — 0 là custom số 0 (thường không hợp lệ ở Custom validate).
2. Composite PK — không duplicate cùng user trên một expense.
3. Xóa expense xóa hết participant/dish — payment **không** cascade (payment độc lập theo tháng/user).
