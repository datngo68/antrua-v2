# AnTrua Design System — MASTER

**Source of truth UI** cho agent và người. Ghi đè skill generic khi xung đột.  
Raw Attio: `Design.md`. Spec: `docs/superpowers/specs/2026-09-10-antrua-ui-rebuild-design.md`.

## Dial (mặc định)

| Dial | Value | Ý nghĩa |
|------|-------|---------|
| Variance | 8 | Asymmetric desktop; mobile 1 cột |
| Motion | 6 | CSS/spring nhẹ, stagger; không cinematic nặng |
| Density | 4 | App hàng ngày; Admin tables dày hơn |

## Brand

| Role | Light | Dark (P7) |
|------|-------|-----------|
| Brand / accent | `#3ABDAF` | `#3ABDAF` |
| Foreground | `#1C1D1F` | `#EFF3F4` |
| Muted | `#666666` | `#97A0AF` |
| Border | `#EBECF0` | `#1C2536` |
| Workspace background | `#F4F5F7` | `#0D0E10` |
| Card / surface | `#FFFFFF` | `#121417` |
| Secondary | `#8BC269` | `#8BC269` |
| Destructive / nợ | `#DC2626` | `#DC2626` |
| On brand | `#FFFFFF` | `#FFFFFF` |

**Một accent brand duy nhất:** teal. Đỏ chỉ semantic (nợ/lỗi/xóa).

## Typography

- **Sans:** Geist (ưu tiên) hoặc Satoshi — **không Inter** (override có chủ đích so với `Design.md`).
- **Mono / số:** Geist Mono hoặc `tabular-nums` cho VND.
- Body ~14–16px, line-height 1.5–1.6.
- Heading: weight 600, `tracking-tight` / letter-spacing ~`-0.01em`.
- Metadata labels: small, semibold; all-caps sparingly (Attio-style tags).

## Radius & elevation

- sm `6px` · md `8px` · lg `12px` (major shells có thể `rounded-xl` ≈ 12).
- Shadow: diffusion nhẹ tint theo nền — **không** neon outer glow.
- Card: 1px border `#EBECF0`; inner border/hairline khi cần “carved” Attio.

## Layout

- Shell desktop: sidebar ~240px + main.
- Shell mobile: bottom nav 5 slots; content `pb-20`.
- Page container: `max-w-[1400px] mx-auto`.
- Full viewport regions: `min-h-[100dvh]` only.
- Grid: CSS Grid; asymmetric Bento trên dashboard.

## Navigation IA

**Desktop:** Tổng quan · Chi phí · Công nợ & Thanh toán · Báo cáo · Nhóm (Admin+) · Cài đặt  

**Mobile bottom:** Tổng quan · Chi phí · Nợ · Báo cáo · Thêm (sheet)

## Components (shadcn-first)

Map CSS variables → shadcn `--primary` = brand teal. Không để violet default.

| Pattern | Quy tắc |
|---------|---------|
| Button primary | Brand fill; press `scale-[0.98]` |
| Button destructive | Đỏ semantic |
| Input | Label trên; border 1px; focus ring brand |
| Table | Spreadsheet: header contrast, 1px, row hover |
| Pill | Soft pastel bg + bold text (`Pending` / `Confirmed`) |
| Sheet/Drawer | Mobile full-height create expense |
| Empty / Skeleton | Bắt buộc trên list/dashboard |

## Motion

- Duration 150–300ms UI; sheet có thể ~300–400ms spring.
- `prefers-reduced-motion: reduce` → tắt stagger/infinite.
- Chỉ animate `transform` và `opacity`.

## Anti-patterns (cấm)

- Purple/AI gradient aesthetic  
- Inter font  
- Emoji as icons  
- `h-screen` cho shell/hero  
- 3 equal feature cards  
- Custom cursor / neon glow / Unsplash  
- Invent component khi shadcn đã đủ  

## Page overrides

Overrides theo trang (nếu có) nằm trong `design-system/pages/<name>.md` và **ghi đè** MASTER khi conflict.
