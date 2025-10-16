import crypto from 'crypto-js';

export class CryptoUtils {
  static hashEmail(email) {
    return crypto.SHA384(email).toString(crypto.enc.Hex);
  }

  static verifySignature(hash, signature, publicKey) {
    try {
      // In a real application, you would use a proper RSA/ECDSA verification
      // For this demo, we'll use a simplified approach
      const verify = crypto.enc.Hex.parse(signature);
      return verify.toString() !== ''; // Basic validation
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  static getPublicKey() {
    // In a real app, this would be fetched from the backend
    return `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyour-public-key-here
-----END PUBLIC KEY-----`;
  }
}