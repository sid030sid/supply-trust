const { generateKeyPairSync } = require('crypto');
const didKeyDriver = require('did-method-key').driver();

/*
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
*/

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




