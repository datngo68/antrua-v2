# Login — page override

Ghi đè MASTER cho màn `/login`.

## Layout

- **Desktop:** split 45/55 — trái brand panel, phải form (không card lệch `ml-[10vw]`).
- **Mobile:** chỉ form; brand thu gọn thành header (logo + tagline), không full hero.
- Không bọc `AppShell`.

## Visual

- Panel trái: nền `#1C1D1F` (hunter), accent teal `#3ABDAF`, pattern CSS thuần (không ảnh stock).
- Panel phải: workspace `#F4F5F7` + surface trắng form.
- Input cao ≥44px; button primary full-width `h-11`.
- Motion: fade/slide nhẹ 200ms; tôn trọng `prefers-reduced-motion`.
