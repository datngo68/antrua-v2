# 07 — Dashboard

Nguồn: `Controllers/HomeController.cs`, `Models/ViewModels/DashboardViewModel.cs`.

## Filter

- Group: cùng pattern multi-tenant ([03-auth-tenancy.md](03-auth-tenancy.md))
- Optional query: `year`, `month`

## KPI

| Metric | Công thức |
|--------|-----------|
| `TotalExpenses` | `Σ Expense.Amount` (sau filter) |
| `TotalTransactions` | `count(expenses)` |
| `TopPayerName` / `TopPayerAmount` | max `Σ Amount` group by `PayerId` |

## Thống kê theo tuần

- Năm chọn (mặc định năm hiện tại)
- Tuần = khối 7 ngày từ 01/01
- Mỗi tuần: `TotalAmount`, `TransactionCount`, danh sách `UserDebts`

Debt tuần (bản hiện tại):

- `TotalAmount` / `PaidAsPayer` theo **share** (công thức participant)
- **Không** trừ payment trên debt tuần
- `UserDebt.PaidAmount` thường không set (0)

## Thống kê theo tháng

- 12 tháng trong năm (hoặc theo filter)
- Mỗi tháng: tổng chi, số GD
- Debt summary: share + `PaidAsPayer` + `PaidAmount`

## Khác biệt quan trọng vs Report

| | Dashboard | Report / Payments Index |
|-|-----------|-------------------------|
| Payment status | **Không** lọc `Confirmed` — Pending cũng cộng `PaidAmount` | Chỉ `Confirmed` |
| Phạm vi nợ | Theo tuần/tháng UI | Monthly report = tháng; PublicView = tích lũy |
| Netting | Không chạy full `NetMutualDebts` như Report | Có |

Rewrite: nếu muốn dashboard khớp báo cáo → filter `Status == "Confirmed"`. Nếu muốn giữ hành vi cũ từng chữ → giữ như hiện tại và ghi chú cho user.

## Deep link

Từ hàng tháng → `Payments/Index?year=&month=` (UI “Xem thanh toán”).
