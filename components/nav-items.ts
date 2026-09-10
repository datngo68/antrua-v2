export const primaryNav = [
  { href: "/", label: "Tổng quan", icon: "House" },
  { href: "/expenses", label: "Chi phí", icon: "Receipt" },
  { href: "/payments", label: "Công nợ", icon: "Scales" },
  { href: "/reports", label: "Báo cáo", icon: "ChartBar" },
] as const;

/** Desktop sidebar — đủ IA MASTER (Nhóm, Cài đặt). Mobile gom vào sheet “Thêm”. */
export const secondaryNav = [
  { href: "/group", label: "Nhóm", icon: "Users" },
  { href: "/settings", label: "Cài đặt", icon: "Gear" },
] as const;

export const moreNav = [
  { href: "/group", label: "Nhóm" },
  { href: "/settings", label: "Cài đặt" },
] as const;

export type NavIcon =
  | (typeof primaryNav)[number]["icon"]
  | (typeof secondaryNav)[number]["icon"];
