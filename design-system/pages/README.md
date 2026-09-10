# Page-level design overrides

Đặt file `design-system/pages/<page>.md` khi một màn hình **lệch** MASTER (ví dụ PublicView tối giản hơn Dashboard).

Khi build trang X:

1. Đọc `design-system/MASTER.md`
2. Nếu tồn tại `pages/<x>.md` → rules trang **ghi đè** MASTER
3. Rồi mới code UI
