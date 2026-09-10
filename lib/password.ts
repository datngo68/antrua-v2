import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

function isMd5Hex(hash: string): boolean {
  return hash.length === 32 && /^[0-9a-fA-F]{32}$/.test(hash);
}

export async function verifyPassword(
  plain: string,
  hash: string | null | undefined,
): Promise<boolean> {
  if (!hash) return false;
  if (isMd5Hex(hash)) {
    const md5 = createHash("md5").update(plain, "utf8").digest("hex");
    return md5.toLowerCase() === hash.toLowerCase();
  }
  return bcrypt.compare(plain, hash);
}
