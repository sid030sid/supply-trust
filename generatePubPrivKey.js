const didKeyDriver = require('did-method-key').driver();
const { Buffer } = require('buffer');

// Function to convert raw key bytes to PEM format
const toPem = (keyBytes, type) => {
    const keyBase64 = Buffer.from(keyBytes).toString('base64');
    const pem = `-----BEGIN ${type} KEY-----\n${keyBase64.match(/.{1,64}/g).join('\n')}\n-----END ${type} KEY-----`;
    return pem;
};

const createDidKey = async () => {

    // Import bs58 library
    const bs58 = await import("bs58");

    // Generate a did:key 
    const didDocument = await didKeyDriver.generate();

    // Get the Ed25519 key pair of the newly generated did:key
    const ed25519KeyPair = Object.values(didDocument.keys)[0];

    // Extract the DID and the Ed25519 public and private keys from the key pair
    console.log("DID:", didDocument.id);
    console.log("Public Key of Ed25519VerificationKey2018 in Base58:", ed25519KeyPair.publicKeyBase58);
    console.log("Private Key of Ed25519VerificationKey2018 in Base58:", ed25519KeyPair.privateKeyBase58);

    // Decode Base58 keys to raw bytes
    const publicKeyBytes = bs58.default.decode(ed25519KeyPair.publicKeyBase58);
    const privateKeyBytes = bs58.default.decode(ed25519KeyPair.privateKeyBase58);

    // Convert to PEM format
    const publicKeyPem = toPem(publicKeyBytes, 'PUBLIC');
    const privateKeyPem = toPem(privateKeyBytes, 'PRIVATE');

    // Output PEM format keys
    console.log("Public Key of Ed25519VerificationKey2018 in PEM format:\n", publicKeyPem);
    console.log("Private Key of Ed25519VerificationKey2018 in PEM format:\n", privateKeyPem);

    // Output keys in UTF-8 format
    console.log("Public Key of Ed25519VerificationKey2018 in UTF-8:", publicKeyBytes.toString('utf-8'));
    console.log("Private Key of Ed25519VerificationKey2018 in UTF-8:", privateKeyBytes.toString('utf-8'));
};

createDidKey();



/*OLD CODE

const { generateKeyPairSync } = require('crypto');
const didKeyDriver = require('did-method-key').driver();


const createDidKey = async () => {
    // Generate an elliptic curve key pair (P-256 curve)
    const { privateKey, publicKey } = generateKeyPairSync('ec', {
        namedCurve: 'P-256',
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });
    
    // generate did:key from public key
    const didDocument = await didKeyDriver.generate({ publicKey });
    
    // return the public key, private key and did document
    console.log("Public Key: ", publicKey);
    console.log("Private Key: ", privateKey);
    console.log("DID Document: ", JSON.stringify(didDocument));
}


const createDidKey = async () => {
    // Generate a did:key 
    const didDocument = await didKeyDriver.generate();

    // Get the Ed25519 key pair of the newly generated did:key
    const ed25519KeyPair = Object.values(didDocument.keys)[0]

    // Extract the DID and the Ed25519 public and private keys from the key pair
    console.log("DID:", didDocument.id);
    console.log("Public Key of Ed25519VerificationKey2018 in Base58:", ed25519KeyPair.publicKeyBase58);
    console.log("Private Key of Ed25519VerificationKey2018 in Base58:", ed25519KeyPair.privateKeyBase58);

    //Extract the public and private keyys in base64
    console.log("Public Key of Ed25519VerificationKey2018 in Base64:", Buffer.from(ed25519KeyPair.publicKeyBase58, 'base64').toString('base64'));
    console.log("Private Key of Ed25519VerificationKey2018 in Base64:", Buffer.from(ed25519KeyPair.privateKeyBase58, 'base64').toString('base64'));
}

createDidKey();
*/




