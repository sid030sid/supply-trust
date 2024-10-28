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
const privateKey = fs.readFileSync("./certs/private.pem", "utf8");

router.route("/").get(async (req, res) => {
  res.status(200).send("Verifier route is working");
});

module.exports = router;