const crypto = require("crypto")
const bs58 = require("bs58");

const generateAccessToken = (sub, credential_identifier) =>{
    const payload = {
      iss: `${serverURL}`,
      sub: sub,
      aud: `${serverURL}`,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      iat: Math.floor(Date.now() / 1000),
      scope: "openid",
      credential_identifier: credential_identifier,
    };
    // Sign the JWT
    const token = jwt.sign(payload, process.env.ISSUER_PRIVATE_KEY);
  
    return token;
}

const generateNonce = (length = 12) => {
  return crypto.randomBytes(length).toString("hex");
}

const convertBase58ToJWK = (base58Key) =>{
  // Decode the base58 public key into bytes
  const keyBytes = bs58.decode(base58Key);

  // Convert the bytes to base64url (required by JWK)
  const base64url = Buffer.from(keyBytes).toString("base64url");

  // Create the JWK object
  const jwk = {
    kty: "OKP",              // Key Type for Ed25519
    crv: "Ed25519",          // Curve for Ed25519
    x: base64url             // Base64url encoded public key bytes
  };

  return jwk;
}

module.exports = {
    generateAccessToken,
    generateNonce,
    convertBase58ToJWK,
};