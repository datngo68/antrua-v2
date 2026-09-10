import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { getSessionOptions } from "@/lib/session-options";

export type SessionData = {
  userId?: number;
  username?: string;
  fullName?: string;
  role?: string;
  groupId?: number | null;
};

export { getSessionOptions } from "@/lib/session-options";

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), getSessionOptions());
}
