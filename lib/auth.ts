import { redirect } from "next/navigation";
import { getSession, type SessionData } from "@/lib/session";

export type SessionUser = {
  userId: number;
  username: string;
  fullName: string;
  role: string;
  groupId: number | null;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session.userId || !session.username || !session.fullName || !session.role) {
    return null;
  }
  return {
    userId: session.userId,
    username: session.username,
    fullName: session.fullName,
    role: session.role,
    groupId: session.groupId ?? null,
  };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export function toSessionFields(user: {
  id: number;
  username: string | null;
  name: string;
  role: string;
  groupId: number | null;
}): SessionData {
  return {
    userId: user.id,
    username: user.username ?? "",
    fullName: user.name,
    role: user.role,
    groupId: user.groupId,
  };
}
