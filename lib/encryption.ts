import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-key-change-in-production";
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || "default-iv-change";

/**
 * Encrypt sensitive data (e.g., bank account numbers)
 */
export function encrypt(text: string): string {
  const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY);
  const iv = CryptoJS.enc.Hex.parse(ENCRYPTION_IV);
  
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  
  return encrypted.toString();
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedText: string): string {
  const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY);
  const iv = CryptoJS.enc.Hex.parse(ENCRYPTION_IV);
  
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * Hash a value (one-way, for tokens etc.)
 */
export function hash(text: string): string {
  return CryptoJS.SHA256(text).toString();
}

/**
 * Generate a random token
 */
export function generateToken(length: number = 32): string {
  return CryptoJS.lib.WordArray.random(length).toString();
}

/**
 * Mask sensitive data for display (e.g., bank account: ****1234)
 */
export function maskSensitive(text: string, visibleChars: number = 4): string {
  if (text.length <= visibleChars) {
    return "*".repeat(text.length);
  }
  const masked = "*".repeat(text.length - visibleChars);
  const visible = text.slice(-visibleChars);
  return masked + visible;
}
