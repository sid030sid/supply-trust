const { generateKeyPairSync } = require('crypto');
const { Buffer } = require('buffer');
const fs = require('fs');
const didKeyDriver = require('did-method-key').driver();
require("dotenv").config();

// Function to convert raw key bytes to PEM format
const toPem = (keyBytes, type) => {
    const keyBase64 = Buffer.from(keyBytes).toString('base64');
    const pem = `-----BEGIN ${type} KEY-----\n${keyBase64.match(/.{1,64}/g).join('\n')}\n-----END ${type} KEY-----`;
    return pem;
};

const createDidKey = async () => {
    // Generate an ECDSA key pair (P-256)
    const { publicKey, privateKey } = generateKeyPairSync('ec', {
        namedCurve: 'prime256v1', // or 'prime256v1' for P-256
        publicKeyEncoding: {
            type: 'spki',
            format: 'der'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'der'
        }
    });

    // Convert keys to PEM format
    const publicKeyPem = toPem(publicKey, 'PUBLIC');
    const privateKeyPem = toPem(privateKey, 'PRIVATE');

    // Create the DID from the public key
    const bs58 = await import("bs58"); // Import bs58 library

    // Encode the public key in Base58 and create the DID
    const publicKeyBuffer = Buffer.from(publicKey);
    const publicKeyBase58 = bs58.default.encode(publicKeyBuffer);
    const did = `did:key:${publicKeyBase58}`;

    // Log the PEM formatted keys and DID
    console.log("DID:", did);
    console.log("Public Key in PEM format:\n", publicKeyPem);
    console.log("Private Key in PEM format:\n", privateKeyPem);

    // Set DID as .env variable
    fs.appendFileSync('.env', `ISSUER_DID=${did}`);

    // store private and public key as pem file in certs folder of backend
    fs.writeFileSync('./backend/certs/private.pem', privateKeyPem);
    fs.writeFileSync('./backend/certs/public.pem', publicKeyPem);
};

createDidKey();

/*FORMER CODE

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
*/


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




