const {pemToJWK} = require('./backend/utils/helperFunctions');
const fs = require("fs")

const publicKey = fs.readFileSync("./backend/certs/public.pem", "utf8");

const publicKeyAsJwk = pemToJWK(publicKey, "public")
console.log(publicKeyAsJwk);