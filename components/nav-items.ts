export const primaryNav = [
  { href: "/", label: "Tổng quan", icon: "House" },
  { href: "/expenses", label: "Chi phí", icon: "Receipt" },
  { href: "/payments", label: "Công nợ", icon: "Scales" },
  { href: "/reports", label: "Báo cáo", icon: "ChartBar" },
] as const;

/** Desktop sidebar — đủ IA MASTER (Nhóm Admin+, Cài đặt). */
export const secondaryNav = [
  { href: "/group", label: "Nhóm", icon: "Users", adminOnly: true },
  { href: "/settings", label: "Cài đặt", icon: "Gear", adminOnly: false },
] as const;

export const moreNav = [
  { href: "/group", label: "Nhóm", adminOnly: true },
  { href: "/settings", label: "Cài đặt", adminOnly: false },
] as const;

export type NavIcon =
  | (typeof primaryNav)[number]["icon"]
  | (typeof secondaryNav)[number]["icon"];
