const router = require('express').Router();
const crypto = require("crypto")
const jwt = require('jsonwebtoken');
const fs = require("fs")
require("dotenv").config();

// load in helper functions
const {generateNonce} = require("../utils/helperFunctions");

// global variables
const serverURL = process.env.BASE_URL+"/api-issuer";
const authServerURL = process.env.BASE_URL+"/api-auth";

// Middleware to authenticate access tokens
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  try {
    const response = await fetch(`${authServerURL}/verifyAccessToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return res.sendStatus(401);
    }
    const result = await response.text();
    console.log("authentication result:", result);
  } catch (error) {
    console.error("Error verifying token:", error);
  }
  next();
};


/* +++++++++++++++++++ Issuer Endpoints ++++++++++++++++++++++++ */

const offerMap = new Map(); //TODO: optimize by using redis instead of in-memory storage

// offer credential that proves ownership of cid
router.post("/offer", async (req, res) => {
    // get cid to which ipfs credential is issued
    const cid = req.body.cid

    // get requested credential type and checck its validness
    const credentialType = req.body.credentialType
    if(credentialType !== "PrivateIpfsAccessCredential" & credentialType !== "PrivateIpfsOwnershipCredential"){
      res.status(400).send("Invalid credential type")
    }

    // create credential offer uuid and pre-authorized code
    const uuid = crypto.randomUUID();
    const pre_authorized_code = generateNonce(32);

    // prepare credential subject based on cid and credential type
    const credentialData = {
      credentialSubject: {
        cid: cid
      },
      type: ["VerifiableCredential", credentialType]
    }

    // create credential offer
    offerMap.set(uuid, { pre_authorized_code, credentialData });

    // send credential offer uri for user to obtain credential via wallet
    let credentialOffer = `openid-credential-offer://?credential_offer_uri=${serverURL}/credential-offer/${uuid}`;
    res.send(credentialOffer);
});

router.route("/credential-offer/:id").get(async (req, res) => {
  const entry = offerMap.get(req.params.id);
  let pre_auth_code;
  let credentialData;

  if (entry) {
    ({
      pre_authorized_code: pre_auth_code,
      credentialData,
    } = entry);

    if (pre_auth_code) { //TODO: understand why this step is done for pre-auth code flow???
      offerMap.set(pre_auth_code, credentialData);
    }
  }

  const response = {
    credential_issuer: `${serverURL}`,
    credentials: credentialData?.type,
    grants: {
      "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
        "pre-authorized_code": pre_auth_code ?? crypto.randomUUID(), //TODO: understand why this step is done for pre-auth code flow???
        user_pin_required: true,
      },
    },
  };

  res.status(200).send(response);
});

router.route("/credential").post(authenticateToken, async (req, res) => {
  
  // get pre-authorization code from authorization access token
  const token = req.headers["authorization"].split(" ")[1];
  const { credential_identifier } = jwt.decode(token);

  // get proof of user's ownership of private key
  const requestBody = req.body;
  let decodedWithHeader;
  let decodedHeaderSubjectDID;
  if (requestBody.proof && requestBody.proof.jwt) {
    decodedWithHeader = jwt.decode(requestBody.proof.jwt, { complete: true });
    decodedHeaderSubjectDID = decodedWithHeader.payload.iss;
  }

  // get credential offer
  const credentialData = offerMap.get(credential_identifier);

  let credentialSubject = {
    id: decodedHeaderSubjectDID, //did of user attempting to obtain vc
    ...credentialData?.credentialSubject,
    issuance_date: new Date(
      Math.floor(Date.now() / 1000) * 1000
    ).toISOString(),
  }

  const payload = {
    iss: serverURL,
    sub: decodedHeaderSubjectDID || "",
    //exp: Math.floor(Date.now() / 1000) + 60 * 60,
    iat: Math.floor(Date.now() / 1000),
    vc: {
      credentialSubject: credentialSubject,
      expirationDate: new Date(
        (Math.floor(Date.now() / 1000) + 60 * 60) * 1000
      ).toISOString(),
      id: decodedHeaderSubjectDID,
      issuanceDate: new Date(
        Math.floor(Date.now() / 1000) * 1000
      ).toISOString(),
      issued: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString(),
      issuer: process.env.ISSUER_DID,
      type: credentialData?.type,
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://europa.eu/2018/credentials/eudi/pid/v1",
      ],
      validFrom: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString(),
    },
  };

  // create vc
  const idtoken = jwt.sign(payload, process.env.ISSUER_PRIVATE_KEY, { algorithm: "ES256" }); // TODO: should be created using ES256????

  // send jwt_vc to user
  res.json({
    format: "jwt_vc",
    credential: idtoken,
    c_nonce: generateNonce(),
    c_nonce_expires_in: 86400,
  });
});

router.route("/.well-known/openid-credential-issuer").get(async (req, res) => {
  const metadata = {
    credential_issuer: `${serverURL}`,
    authorization_server: `${authServerURL}`,
    credential_endpoint: `${serverURL}/credential`,
    credential_response_encryption: { //TODO: think about removing as only optional
      alg_values_supported: ["ECDH-ES"],
      enc_values_supported: ["A128GCM"],
      encryption_required: false,
    },
    display: [
      {
        name: "SupplyTrust",
        locale: "en-US",
        logo: { //TODO: logo's attribute should actually be uri not url according to OID4VCI
          url: "https://www.coywolf.news/wp-content/uploads/2021/05/pinata-logo.webp" //TODO replace with self made logo for trust supply
        },
      },
    ],
    credential_configurations_supported: {
      PrivateIpfsAccessCredential: {
        format: "jwt_vc_json",
        scope: "PrivateIpfsAccessCredential",
        cryptographic_binding_methods_supported: ["did:example"],
        credential_signing_alg_values_supported: ["ES256"],
        credential_definition: {
          type: ["VerifiableCredential", "PrivateIpfsAccessCredential"],
          credentialSubject: {
            cid: {
              display: [
                {
                  name: "CID",
                  locale: "en-US",
                },
              ],
            }
          },
        },
        proof_types_supported: {
          jwt: {
            proof_signing_alg_values_supported: ["ES256"],
          },
        },
        display: [
          {
            name: "Private IPFS Access Credential powered by Pinata",
            locale: "en-US",
            logo: {
              url: "https://docs.ipfs.tech/images/ipfs-logo.svg",
            },
            background_color: "#12107c",
            text_color: "#FFFFFF",
          },
        ],
      },
      PrivateIpfsOwnershipCredential: {
        format: "jwt_vc_json",
        scope: "PrivateIpfsOwnershipCredential",
        cryptographic_binding_methods_supported: ["did:example"],
        credential_signing_alg_values_supported: ["ES256"],
        credential_definition: {
          type: ["VerifiableCredential", "PrivateIpfsOwnershipCredential"],
          credentialSubject: {
            cid: {
              display: [
                {
                  name: "CID",
                  locale: "en-US",
                },
              ],
            }
          },
        },
        proof_types_supported: {
          jwt: {
            proof_signing_alg_values_supported: ["ES256"],
          },
        },
        display: [
          {
            name: "Private IPFS Ownership Credential powered by Pinata",
            locale: "en-US",
            logo: {
              url: "https://docs.ipfs.tech/images/ipfs-logo.svg",
            },
            background_color: "#12107c",
            text_color: "#FFFFFF",
          },
        ],
      }
    },
  };
  res.status(200).send(metadata);
});

module.exports = router;