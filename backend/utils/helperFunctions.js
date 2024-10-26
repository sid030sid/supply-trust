const crypto = require("crypto")

const generateNonce = (length = 12) => {
  return crypto.randomBytes(length).toString("hex");
}

const convertBase58ToJWK = async (base58Key) =>{
    // import library for base58 encoding
    const bs58 = await import("bs58");

    // Decode the base58 public key into bytes
    const keyBytes = bs58.default.decode(base58Key);

    // Convert the bytes to base64url (required by JWK)
    const base64url = Buffer.from(keyBytes).toString("base64url");

    // Create the JWK object
    const jwk = {
        kty: "OKP", // Key Type for Ed25519
        crv: "Ed25519", // Curve for Ed25519
        x: base64url, // Base64url encoded public key bytes
        alg: "EdDSA", // Algorithm (EdDSA for Ed25519)
        use: "sig" // Public key use (sig for signature verification)
    };

    return jwk;
}

const bs58toPem = async (base58Key, type) => {
    // import library for base58 encoding
    const bs58 = await import("bs58");

    // Decode the base58 public key into bytes
    const keyBytes = bs58.default.decode(base58Key);

    // Convert to Pem format
    const keyBase64 = Buffer.from(keyBytes).toString('base64');
    const pem = `-----BEGIN ${type} KEY-----\n${keyBase64.match(/.{1,64}/g).join('\n')}\n-----END ${type} KEY-----`;
    return pem;
};

const pemToJWK = (pem, keyType) => {
    let key;
    let jwk;
  
    if (keyType === "private") {
      key = crypto.createPrivateKey(pem);
      // Export JWK including the private key parameter (`d`)
      jwk = key.export({ format: "jwk" }); // This includes x, y, and d for EC keys
    } else {
      key = crypto.createPublicKey(pem);
      // Export JWK with only public components
      jwk = key.export({ format: "jwk" }); // This includes x and y for EC keys
    }
  
    // Optionally, set or adjust JWK properties if necessary
    jwk.kty = "EC"; // Key Type
    jwk.crv = "P-256"; //"P-384"; // Curve (adjust as necessary based on your actual curve)
  
    return jwk;
}

module.exports = {
    generateNonce,
    convertBase58ToJWK,
    bs58toPem,
    pemToJWK
};