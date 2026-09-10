const GROUP_ADMIN_ROLES = new Set(["Admin", "SuperAdmin"]);

/** Nhóm (Admin+) — IA MASTER. */
export function canManageGroup(role: string): boolean {
  return GROUP_ADMIN_ROLES.has(role);
}
