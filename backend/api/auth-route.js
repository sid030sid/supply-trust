//this endpoint is used to authenticate the user by verifying the presented verifiable credentials
const router = require('express').Router();
const crypto = require("crypto")
const jwt = require('jsonwebtoken');
const fs = require("fs")

require("dotenv").config();

//global variables
const serverURL = process.env.BASE_URL+"/api-issuer";
const authServerURL = process.env.BASE_URL+"/api-auth";

// In-memory storage
const authorizationCodes = new Map();
const accessTokens = new Map();

//helper functions
const generateAccessToken = (sub, credential_identifier) => {
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
  
const buildIdToken = (aud) => {
    const payload = {
      iss: `${serverURL}`,
      sub: "user123",
      aud: aud,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      iat: Math.floor(Date.now() / 1000),
      auth_time: Math.floor(Date.now() / 1000) - 60 * 5,
      nonce: "nonceValue",
    };
  
    const idToken = jwt.sign(payload, process.env.ISSUER_PRIVATE_KEY);
  
    return idToken;
}

router.route("/verifyAccessToken").post((req, res) => {
    const token = req.body.token;
  
    if (!token) {
      return res.status(400).send("Token is required");
    }
  
    jwt.verify(token, process.env.ISSUER_PUBLIC_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).send("Invalid token");
      }
  
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        return res.status(401).send("Token has expired");
      }
  
      const storedToken = accessTokens.get(decoded.sub);
      if (storedToken !== token) {
        return res.status(401).send("Invalid token");
      }
  
      res.status(200).send("Token is valid");
    });
});
  
router.route("/.well-known/openid-configuration").get((req, res) => {
    const config = {
      issuer: `${serverURL}`,
      authorization_endpoint: `${authServerURL}/authorize`,
      token_endpoint: `${authServerURL}/token`,
      jwks_uri: `${authServerURL}/jwks`,
      scopes_supported: ["openid"],
      response_types_supported: ["vp_token", "id_token"],
      response_modes_supported: ["query"],
      grant_types_supported: ["authorization_code", "pre-authorized_code"],
      subject_types_supported: ["public"],
      id_token_signing_alg_values_supported: ["ES256"],
      request_object_signing_alg_values_supported: ["ES256"],
      request_parameter_supported: true,
      request_uri_parameter_supported: true,
      token_endpoint_auth_methods_supported: ["private_key_jwt"],
      request_authentication_methods_supported: {
        authorization_endpoint: ["request_object"],
      },
      vp_formats_supported: {
        jwt_vp: {
          alg_values_supported: ["ES256"],
        },
        jwt_vc: {
          alg_values_supported: ["ES256"],
        },
      },
      subject_syntax_types_supported: [
        "did:key:jwk_jcs-pub",
      ],
      id_token_types_supported: [
        "subject_signed_id_token",
        "attester_signed_id_token",
      ],
    };
    res.status(200).send(config);
});

router.route("/authorize").get((req, res) => {
    const {
      response_type,
      scope,
      state,
      client_id,
      authorization_details,
      redirect_uri,
      nonce,
      code_challenge,
      code_challenge_method,
      client_metadata,
      issuer_state,
    } = req.query;
  
    if (!client_id) {
      return res.status(400).send("Client id is missing");
    }
  
    if (!redirect_uri) {
      return res.status(400).send("Missing redirect URI");
    }
  
    if (response_type !== "code") {
      return res.status(400).send("Unsupported response type");
    }
  
    if (code_challenge_method !== "S256") {
      return res.status(400).send("Invalid code challenge method");
    }
  
    authorizationCodes.set(client_id, {
      codeChallenge: code_challenge,
      authCode: null,
      issuer_state: issuer_state,
    });
  
    const responseType = "id_token";
    const responseMode = "direct_post";
    const redirectURI = `${authServerURL}/direct_post`;
  
    const payload = {
      iss: serverURL,
      aud: client_id,
      nonce: nonce,
      state: state,
      client_id: client_id,
      response_uri: client_id,
      response_mode: responseMode,
      response_type: responseType,
      scope: "openid",
    };
  
    const requestJar = jwt.sign(payload, process.env.ISSUER_PRIVATE_KEY);
    const redirectUrl = `${redirect_uri}?state=${state}&client_id=${client_id}&redirect_uri=${redirectURI}&response_type=${responseType}&response_mode=${responseMode}&scope=openid&nonce=${nonce}&request=${requestJar}`;
    return res.redirect(302, redirectUrl);
});
  
router.route("/direct_post",).post(async (req, res) => {
    let state = req.body["state"];
    let id_jwt = req.body["id_token"];
    if (id_jwt) {
      //TODO: verify id_token if necessary
      const iss = decode(id_jwt).iss;
      const authorizationCode = generateNonce(32);
      if (authorizationCodes.has(iss)) {
        const currentValue = authorizationCodes.get(iss);
        authorizationCodes.set(iss, {
          ...currentValue,
          authCode: authorizationCode,
        });
      }
      const redirectUrl = `http://localhost:8080?code=${authorizationCode}&state=${state}`;
      return res.redirect(302, redirectUrl);
    } else {
      return res.sendStatus(500);
    }
});
  
router.route("/token").post(async (req, res) => {
    const { client_id, code, code_verifier, grant_type, user_pin } = req.body;
    const pre_authorized_code = req.body["pre-authorized_code"];
    let credential_identifier;
    if (grant_type === "urn:ietf:params:oauth:grant-type:pre-authorized_code") {
      console.log("pre-auth code flow: ", pre_authorized_code);
  
      //TODO: implement this: verify the user_pin with the issuer generated pin
      if (user_pin !== "1234") {
        console.log("Invalid pin: ", user_pin);
        return res.status(400).send("Invalid pin");
      }
      credential_identifier = pre_authorized_code;
    } else {
        return res.status(400).send("Only pre-authorized_code grant type is supported!");
    }
    const generatedAccessToken = generateAccessToken(
      client_id,
      credential_identifier
    );
    accessTokens.set(client_id, generatedAccessToken);

    console.log("created access token:", generatedAccessToken)
  
    res.json({
      access_token: generatedAccessToken,
      token_type: "bearer",
      expires_in: 86400,
      c_nonce: generateNonce(16),
      c_nonce_expires_in: 86400,
    });
});

module.exports = router;