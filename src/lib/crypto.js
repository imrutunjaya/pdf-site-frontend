import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
export const MAGIC_PREFIX = 'ENCRYPTED_PDFV1:';
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

/**
 * Derives a 32-byte key from the given password.
 */
function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

/**
 * Encrypts a buffer.
 * Output format: [MAGIC_PREFIX][SALT][IV][AUTH_TAG][ENCRYPTED_DATA]
 */
export function encryptBuffer(buffer, password) {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = deriveKey(password, salt);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  return Buffer.concat([
    Buffer.from(MAGIC_PREFIX, 'utf8'),
    salt,
    iv,
    authTag,
    encrypted
  ]);
}

/**
 * Checks if a buffer is encrypted based on the magic prefix.
 */
export function isEncrypted(buffer) {
  const magic = Buffer.from(MAGIC_PREFIX, 'utf8');
  if (buffer.length < magic.length) return false;
  return buffer.slice(0, magic.length).equals(magic);
}

/**
 * Decrypts a buffer.
 * Expects format: [MAGIC_PREFIX][SALT][IV][AUTH_TAG][ENCRYPTED_DATA]
 */
export function decryptBuffer(buffer, password) {
  const magic = Buffer.from(MAGIC_PREFIX, 'utf8');
  if (!buffer.slice(0, magic.length).equals(magic)) {
    throw new Error('Not an encrypted buffer');
  }
  
  let offset = magic.length;
  
  const salt = buffer.slice(offset, offset + SALT_LENGTH);
  offset += SALT_LENGTH;
  
  const iv = buffer.slice(offset, offset + IV_LENGTH);
  offset += IV_LENGTH;
  
  const authTag = buffer.slice(offset, offset + AUTH_TAG_LENGTH);
  offset += AUTH_TAG_LENGTH;
  
  const encryptedData = buffer.slice(offset);
  
  const key = deriveKey(password, salt);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  return decrypted;
}
