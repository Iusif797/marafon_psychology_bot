import { createHash, timingSafeEqual } from "crypto";

export function verifyLegacyHash(password: string, hash: string): boolean {
  if (hash.length !== 64) return false;
  const expected = createHash("sha256").update(`marafon_static_salt:${password}`).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(hash));
  } catch {
    return false;
  }
}
