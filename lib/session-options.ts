import type { SessionOptions } from "iron-session";

function requireSessionPassword(): string {
  const password = process.env.SESSION_PASSWORD;
  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_PASSWORD is required and must be at least 32 characters",
    );
  }
  return password;
}

export function getSessionOptions(): SessionOptions {
  return {
    password: requireSessionPassword(),
    cookieName: ".AnTrua.Session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    },
  };
}
