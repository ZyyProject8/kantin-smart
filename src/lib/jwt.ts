import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-kantin-key-change-this-in-production";

export function signJWT(payload: any, expiresInStr?: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const b64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
  
  // Basic expiry logic (e.g. "1d")
  let exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // default 1 day
  if (expiresInStr === "7d") {
    exp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
  }
  
  const payloadWithExp = { ...payload, exp };
  const b64Payload = Buffer.from(JSON.stringify(payloadWithExp)).toString("base64url");

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${b64Header}.${b64Payload}`)
    .digest("base64url");

  return `${b64Header}.${b64Payload}.${signature}`;
}

export function verifyJWT(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [b64Header, b64Payload, signature] = parts;

    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${b64Header}.${b64Payload}`)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(b64Payload, "base64url").toString("utf-8"));
    
    // Check expiry
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}
