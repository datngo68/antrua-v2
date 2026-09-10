import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { toSessionFields } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { users } from "@/lib/schema/users";
import { getSession, sessionOptions } from "@/lib/session";

export async function POST(request: Request) {
  let body: { username?: string; password?: string; remember?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const username = body.username?.trim();
  const password = body.password ?? "";
  if (!username || !password) {
    return NextResponse.json(
      { error: "Sai tên đăng nhập hoặc mật khẩu" },
      { status: 401 },
    );
  }

  const row = db
    .select()
    .from(users)
    .where(and(eq(users.username, username), eq(users.isActive, true)))
    .get();

  if (!row || !(await verifyPassword(password, row.passwordHash))) {
    return NextResponse.json(
      { error: "Sai tên đăng nhập hoặc mật khẩu" },
      { status: 401 },
    );
  }

  const session = await getSession();
  Object.assign(session, toSessionFields(row));
  // ponytail: RememberMeToken table — add when porting legacy remember tokens
  if (body.remember === false) {
    session.updateConfig({
      ...sessionOptions,
      cookieOptions: {
        ...sessionOptions.cookieOptions,
        maxAge: undefined,
      },
    });
  }
  await session.save();

  return NextResponse.json({
    ok: true,
    user: {
      userId: row.id,
      username: row.username,
      fullName: row.name,
      role: row.role,
      groupId: row.groupId,
    },
  });
}
