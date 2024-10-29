const router = require('express').Router();
const crypto = require("crypto")
const jwt = require('jsonwebtoken');
const fs = require("fs")
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { URLSearchParams } = require('url');
const axios = require('axios');
const { decodeSdJwt, getClaims } = require('@sd-jwt/decode');
const { digest } = require('@sd-jwt/crypto-nodejs');
const WebSocket = require('ws');

// load in helper functions
const {generateNonce, pemToJWK, buildVpRequestJwt} = require("../utils/helperFunctions");

// load in presentation definition of credentials
const {ownership_vc_presentation_definition} = require("../utils/presentationDefinitions");

// global variables
const serverURL = process.env.BASE_URL+"/api-verifier";
const authServerURL = process.env.BASE_URL+"/api-auth";
const privateKey = fs.readFileSync("./certs/private.pem", "utf8");
const publicKey = fs.readFileSync("./certs/public.pem", "utf8");
const publicKeyAsJwk = pemToJWK(publicKey, "public")

// get vp request uri for private ipfs access credential or private ipfs ownership credential
router.route("/generate-vp-request").get(async (req, res) => {
    try {
    // Get parameters from the request URL
    const stateParam = req.query.state || uuidv4();

    //TODO in future: add dynamic uuid to IDs of presentation definition: ownership_vc_presentation_definition
    const request_uri = `${serverURL}/get-vp-request/${stateParam}?pd=${JSON.stringify(ownership_vc_presentation_definition)}`;

    // Build the VP request URI
    const vpRequest = `openid4vp://?client_id=${encodeURIComponent(serverURL)}&request_uri=${encodeURIComponent(request_uri)}`

    // Return the VP request as JSON
    res.status(200).json({state: stateParam, vpRequest: vpRequest});
    } catch (error) {
        console.error("Error in /generate-vp-request endpoint:", error);
        res.status(500).send("Internal server error");
    }
});

router.route('/get-vp-request/:state').get( async (req, res) => {
    try {
      const state = req.params.state || uuidv4();
      const pd = req.query.pd;
  
      if (!pd) {
        return res.status(400).send("Presentation definition is required");
      }
  
      const nonce = generateNonce(16);
      const response_uri = `${serverURL}/direct-post/${state}`;
      const clientId = `${serverURL}/direct-post/${state}`;
  
      const jwtToken = buildVpRequestJwt(
        state,
        nonce,
        clientId,
        response_uri,
        JSON.parse(pd),
        publicKeyAsJwk,
        serverURL,
        privateKey
      );
  
      return res.status(200).send(jwtToken.toString());
    } catch (error) {
      console.error("Error generating JWT:", error);
      return res.status(500).send("Internal Server Error");
    }
});

router.route('/direct-post/:state').post(async (req, res) => {
    try {
        const state = req.params.state;
        const decodedVPToken = jwt.decode(req.body.vp_token);
        const decodedVerifiableCredential = jwt.decode(decodedVPToken.vp.verifiableCredential[0]);
        const cid = decodedVerifiableCredential.vc.credentialSubject.cid;
        const did = decodedVerifiableCredential.vc.credentialSubject.did;
        const didDocumentVersion = decodedVerifiableCredential.vc.credentialSubject.didDocumentVersion;
        const credentialTypes = decodedVerifiableCredential.vc.type;
        const issuer = decodedVerifiableCredential.vc.issuer;

        //check validity of verifiable presentation
        if(issuer !== process.env.ISSUER_DID){
            return res.status(401).send("Invalid issuer");
        }
        if(!credentialTypes.includes("PrivateIpfsOwnershipCredential")){
            return res.status(402).send("Invalid credential type");
        }

        //since vc is valid, issue Bearer Token for accessing private ipfs
        const payload = {
            did: did,
            cid: cid,
            didDocumentVersion: didDocumentVersion,
            role: credentialTypes.includes("PrivateIpfsOwnershipCredential") ? "ownership" : "access",
            exp: Math.floor(Date.now() / 1000) + 60 * 60, //1h validity
        };
        const token = jwt.sign(payload, privateKey, { algorithm: "ES256" });

        // send token to client via websocket
        const wsClient = Array.from(req.app.get("wss").clients).find(client => client.state === state); //TODO for dev: this should be ws instead of wss
        if (wsClient && wsClient.readyState === WebSocket.OPEN) { // Check for WebSocket client and send token if connected
            wsClient.send(JSON.stringify({ token }));
        }

        res.status(200).send("Token sent via WebSocket");

        /*
        // Parse the request body as a URL-encoded string
        const urlEncodedString = await req.text();
        const urlParams = new URLSearchParams(urlEncodedString);
        const requestBody = {};

        // Split and destructure the state parameter
        const state = req.params.state.split(";");

        // Populate requestBody with parsed URL parameters
        for (const [key, value] of urlParams.entries()) {
            requestBody[key] = value;
        }

        const vp_token = requestBody.vp_token;

        // Decode and process vp_token
        const decodedVPToken = await decodeSdJwt(vp_token, digest);
        const claims = await getClaims(
            decodedVPToken.jwt.payload,
            decodedVPToken.disclosures,
            digest
        );

        if (claims) {
            const vpToken = claims.vp.verifiableCredential[0];
            const decodedVpToken = jwtDecode(vpToken);

            // Return the decoded VP token and state as JSON
            res.status(200).json({state0: state[0],
                token: {
                    vpToken,
                    vc: decodedVpToken.vc,
                },
            state1: state[1]});
        }else{
            res.status(500).json({error: "Claims not found"});
        }
        */
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;