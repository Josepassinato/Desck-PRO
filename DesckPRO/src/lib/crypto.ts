/**
 * Criptografia client-side para credenciais ERP.
 * Usa Web Crypto API (AES-GCM 256-bit).
 *
 * Em produção, a chave de criptografia deve vir de uma variável de ambiente
 * e idealmente a criptografia deve ser feita server-side (Edge Function).
 * Esta implementação é uma camada de proteção adicional — a defesa primária
 * é RLS + Supabase Vault.
 */

const ENCRYPTION_KEY = import.meta.env.VITE_CREDENTIALS_KEY || "desckpro-default-key-change-in-production";

async function deriveKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("desckpro-salt-v1"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Criptografa um objeto de credenciais.
 * Retorna string base64 com iv + ciphertext.
 */
export async function encryptCredentials(
  credentials: Record<string, string>
): Promise<string> {
  const key = await deriveKey(ENCRYPTION_KEY);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(credentials));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  // Concatena iv (12 bytes) + ciphertext
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Descriptografa uma string base64 de volta para o objeto de credenciais.
 */
export async function decryptCredentials(
  encryptedBase64: string
): Promise<Record<string, string>> {
  const key = await deriveKey(ENCRYPTION_KEY);
  const combined = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));

  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decrypted));
}
