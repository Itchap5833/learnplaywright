import crypto from 'crypto';

const secretKeyEnvName = 'PASSWORD_SECRET_KEY';

export class PasswordUtils {
  private static getKey(): Buffer {
    const secret = process.env[secretKeyEnvName];
    if (!secret) {
      throw new Error(
        `${secretKeyEnvName} is required to encrypt or decrypt passwords. ` +
          `Set it before running tests or the encrypt-password script.`
      );
    }
    return crypto.createHash('sha256').update(secret, 'utf8').digest();
  }

  static encryptPassword(password: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', PasswordUtils.getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return `${iv.toString('base64')}:${encrypted.toString('base64')}:${authTag.toString('base64')}`;
  }

  static decryptPassword(encryptedPassword: string): string {
    const parts = encryptedPassword.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted password format. Expected iv:ciphertext:tag.');
    }

    const [ivBase64, encryptedBase64, tagBase64] = parts;
    const iv = Buffer.from(ivBase64, 'base64');
    const encrypted = Buffer.from(encryptedBase64, 'base64');
    const authTag = Buffer.from(tagBase64, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-gcm', PasswordUtils.getKey(), iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  }
}
