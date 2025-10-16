const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class CryptoUtils {
  constructor() {
    this.keysPath = path.join(__dirname, '../../keys');
    console.log('Keys path:', this.keysPath);
    this.ensureKeyPair();
  }

  ensureKeyPair() {
    console.log('Ensuring key pair exists...');
    
    if (!fs.existsSync(this.keysPath)) {
      console.log('Creating keys directory...');
      try {
        fs.mkdirSync(this.keysPath, { recursive: true });
        console.log('Keys directory created successfully');
      } catch (err) {
        console.error('Failed to create keys directory:', err);
        return;
      }
    }

    const privateKeyPath = path.join(this.keysPath, 'private.pem');
    const publicKeyPath = path.join(this.keysPath, 'public.pem');

    console.log('Private key path:', privateKeyPath);
    console.log('Public key path:', publicKeyPath);

    if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
      console.log('Generating new key pair...');
      this.generateKeyPair();
    } else {
      console.log('Key pair already exists');
    }
  }

  generateKeyPair() {
    console.log('Generating RSA key pair...');
    try {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });

      const privateKeyPath = path.join(this.keysPath, 'private.pem');
      const publicKeyPath = path.join(this.keysPath, 'public.pem');

      fs.writeFileSync(privateKeyPath, privateKey);
      fs.writeFileSync(publicKeyPath, publicKey);
      
      console.log('Key pair generated and saved successfully');
    } catch (error) {
      console.error('Failed to generate key pair:', error);
    }
  }

  getPrivateKey() {
    try {
      const privateKey = fs.readFileSync(path.join(this.keysPath, 'private.pem'), 'utf8');
      console.log('Private key loaded, length:', privateKey.length);
      return privateKey;
    } catch (error) {
      console.error('Failed to read private key:', error);
      throw error;
    }
  }

  getPublicKey() {
    try {
      return fs.readFileSync(path.join(this.keysPath, 'public.pem'), 'utf8');
    } catch (error) {
      console.error('Failed to read public key:', error);
      throw error;
    }
  }

  hashEmail(email) {
    console.log('Hashing email:', email);
    const hash = crypto.createHash('sha384').update(email).digest('hex');
    console.log('Hash result length:', hash.length);
    return hash;
  }

  signHash(hash) {
    console.log('Signing hash, length:', hash.length);
    try {
      const privateKey = this.getPrivateKey();
      const sign = crypto.createSign('SHA384');
      sign.update(hash);
      sign.end();
      const signature = sign.sign(privateKey, 'hex');
      console.log('Signature created, length:', signature.length);
      return signature;
    } catch (error) {
      console.error('Failed to sign hash:', error);
      throw error;
    }
  }

  verifySignature(hash, signature) {
    try {
      const publicKey = this.getPublicKey();
      const verify = crypto.createVerify('SHA384');
      verify.update(hash);
      verify.end();
      return verify.verify(publicKey, signature, 'hex');
    } catch (error) {
      return false;
    }
  }
}

module.exports = new CryptoUtils();