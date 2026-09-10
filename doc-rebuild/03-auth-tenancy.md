# 03 — Auth & multi-tenant

Nguồn: `Helpers/SessionHelper.cs`, `Helpers/PasswordHelper.cs`, `Helpers/AuthorizeAttribute.cs`, `Controllers/AccountController.cs`, `Controllers/BaseController.cs`, `Program.cs`.

## Session-based auth

Không dùng ASP.NET Identity / JWT cho web app chính.

| Session key | Type | Nguồn |
|-------------|------|--------|
| `UserId` | int? | `user.Id` |
| `Username` | string | `user.Username` |
| `FullName` | string | `user.Name` |
| `Role` | string | `user.Role` |
| `GroupId` | int? | `user.GroupId` (remove key nếu null) |

- Cookie name: `.QuanLyAnTrua.Session`
- `IdleTimeout` = 30 ngày; cookie `MaxAge` = 30 ngày
- Luôn đọc/ghi qua `SessionHelper` (không hardcode string key rải rác nếu port)

### Authorize custom

- `[Authorize]` (`QuanLyAnTrua.Helpers`): chỉ kiểm `Session.UserId != null`
- `[AllowAnonymous]`: bỏ qua (Login, webhook, PublicView…)
- **Không** dùng `Microsoft.AspNetCore.Authorization.Authorize`

### Remember-me

Cookies: `RememberMeUserId`, `RememberMeToken` (30 ngày).

GET Login: nếu có `RememberMeUserId` parse được + user `IsActive` → set lại session.  
**Lưu ý:** bản hiện tại không verify token server-side chặt — rewrite nên cải thiện nhưng vẫn phải đọc cookie cũ nếu muốn seamless login.

### Login flow

1. Username + password bắt buộc
2. Tìm `Users` với `Username` + `IsActive`
3. `PasswordHelper.VerifyPassword`
4. Set session keys; optional remember-me cookies
5. Redirect Home

Logout: clear session (+ cookies remember nếu có).

## Password

```
HashPassword(plain)  → BCrypt salt rounds 12
VerifyPassword(plain, hash):
  if hash length == 32 and hex → compare MD5(plain)   // legacy
  else → BCrypt.Verify
```

Không lưu plain text. Không log password / token.

## Roles

| Role | GroupId | Phạm vi data |
|------|---------|--------------|
| `SuperAdmin` | thường `null` | Mọi group; filter optional `groupId` query |
| `Admin` | group của mình | CRUD trong group; confirm payment trong group |
| `User` | group của mình | Data group; expense chỉ sửa/xóa khi mình là Payer; không tạo payment admin; confirm khi là creditor (logic Reports) |

Giá trị `Role` là **string** trong DB đúng các literal trên.

## Group filter (mọi query dữ liệu)

Pattern chuẩn (`BaseController` / services):

```
if IsSuperAdmin:
  optional filter by query groupId
else:
  if session.GroupId has value:
    query = query.Where(x => x.GroupId == session.GroupId)
  else:
    query = empty  // Where(false) — không trả data
```

`CheckGroupAccess(groupId)`:

- SuperAdmin → true
- else → `session.GroupId == groupId`

### Users dropdown

- Non-SA không group → chỉ chính mình
- Trong group → users cùng group (+ logic IsActive tùy action)

### Expense permission (tóm tắt)

| Role | Sửa/Xóa expense |
|------|-----------------|
| SuperAdmin | Full |
| Admin | Cùng group |
| User | Cùng group **và** `PayerId == currentUserId` |

Chi tiết create/edit: xem [04-expenses.md](04-expenses.md).

## Seed SuperAdmin

Xem [02-database-schema.md](02-database-schema.md) § Seed. Rewrite phải có bước tương đương nếu DB trống; nếu gắn DB production đã có SuperAdmin thì không tạo trùng (match theo Name + Role như `SeedDataService`).
