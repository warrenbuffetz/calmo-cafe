export const ADMIN_COOKIE_NAME = "calmo_admin";
export const ADMIN_COOKIE_SALT = "calmo-admin-session-v1";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 12; // 12 hours

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(message),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminSessionToken(pin: string): Promise<string> {
  return hmacSha256Hex(pin, ADMIN_COOKIE_SALT);
}

export async function verifyAdminSessionToken(
  pin: string,
  token: string,
): Promise<boolean> {
  try {
    const expected = await createAdminSessionToken(pin);
    if (token.length !== expected.length) return false;

    let mismatch = 0;
    for (let i = 0; i < token.length; i += 1) {
      mismatch |= token.charCodeAt(i) ^ expected.charCodeAt(i);
    }

    return mismatch === 0;
  } catch {
    return false;
  }
}
