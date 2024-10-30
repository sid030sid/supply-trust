const router = require('express').Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require("dotenv").config();
const {PinataSDK: PinataIpfsApi} = require("pinata-web3");
const {PinataSDK: PinataFileApi} = require("pinata");

// instantiate the ipfs api aka public ipfs storage
const ipfsApi = new PinataIpfsApi({
  pinataJwt: process.env.PINATA_API_JWT,
  pinataGateway: process.env.PINATA_API_GATEWAY,
});

// instantiate the file api aka private ipfs storage
const fileApi = new PinataFileApi({
    pinataJwt: process.env.PINATA_API_JWT,
    pinataGateway: process.env.PINATA_API_GATEWAY,
});

const publicKey = fs.readFileSync("./certs/public.pem", "utf8");
const privateKey = fs.readFileSync("./certs/private.pem", "utf8");

router.route('/upload').post(async (req, res)=>{
    try {

        if(req.query.private===""){
            res.send("ERROR - Invalid query: mising info on private in query")
        }

        if(req.body.data===""){
            res.send("ERROR - Invalid query: missing data in body")
        }

        const filename = crypto.randomUUID() //create nonce to name file note: without name private ipfs by pinata does not work
        const file = new File([JSON.stringify(req.body.data)], filename, { type: "text/plain" });

        // upload file to private or public ipfs depending on configuration set by user in query 
        let upload;
        let cid;
        if(req.query.private==="true"){
            // TODO in future: check if requester is authorized to upload to private ipfs?

            // upload file to private ipfs
            upload = await fileApi.upload.file(file);
            cid = upload.cid
        }else{
            //upload file to public ipfs
            upload = await ipfsApi.upload.file(file);
            cid = upload.IpfsHash
        }

        // send response to frontend
        if(cid !== ""){
            res.send(cid)
        }else{
            res.send("ERROR")
        }
    } catch (error) {
        console.log(error)
    }
})

router.route('/download-public-ipfs/:cid').get(async (req, res) => {
    try {
        const cid = req.params.cid;

        if (cid === "") {
            return res.status(400).send("ERROR - Invalid query: missing cid in params");
        }

        const data = await ipfsApi.gateways.get(cid);
        console.log(data)

        // If data was found, send it to the client
        if (data) {
            return res.send(data);
        } else {
            return res.status(404).send("File not found on IPFS");
        }
    } catch (error) {
        console.error("Error in download route:", error);
        return res.status(500).send("Server error");
    }
});

router.route('/download-private-ipfs/:cid').get(async (req, res) => {
    try {
        // get cid from params and check if it is present
        const cid = req.params.cid;
        if (cid === "") {
            return res.status(400).send("ERROR - Invalid query: missing cid in params");
        }

        // get bearer token and check if it is present
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) return res.status(400).send("ERROR - Bearer token missing in headers");

        // check validity of token for request
        jwt.verify(token, privateKey, async (err, decoded) => { //TODO: should NOT be public key
            if (err) {
              return res.status(401).send("Invalid token");
            }
            if (decoded.exp < Math.floor(Date.now() / 1000)) {
              return res.status(402).send("Token has expired");
            }
          
            if (decoded.cid !== cid) {
              return res.status(403).send("Token valid for private IPFS file with cid: " + decoded.cid+" and not cid: "+cid);
            }
          
            // download file from private ipfs
            const file = await fileApi.gateways.get(cid);
            const data = file.data

            // If data was found, send it to the client
            if (data) {
                return res.send(data);
            } else {
                return res.status(404).send("File not found in private IPFS");
            }
        });
    } catch (error) {
        console.error("Error in download route:", error);
        return res.status(500).send("Server error");
    }
});

/*
//TODO: add middleware that checks if user is authorized to download from private ipfs
router.route('/download/:cid').get(async (req, res) => {
    try {
        const cid = req.params.cid;

        if (cid === "") {
            return res.status(400).send("ERROR - Invalid query: missing cid in params");
        }
        
        let data;
        
        // Attempt to download file from public IPFS
        data = await ipfsApi.gateways.get(cid);

        // If data was found, send it to the client
        if (data) {
            return res.send(data);
        } else {
            return res.status(404).send("File not found on IPFS");
        }
    } catch (error) {
        if (error.statusCode === 403 && error.details.includes("The owner of this gateway does not have this content pinned")) {
            // get file from private ipfs
            const file = await fileApi.gateways.get(cid);
            data = await file.data.text()

            // If data was found, send it to the client
            if (data) {
                return res.send(data);
            } else {
                return res.status(404).send("File not found in private IPFS");
            }
        } else {
            console.error("Error in download route:", error);
            return res.status(500).send("Server error");
        }
    }
});
*/

//TODO: endpoint that returns true if ipfs file is private, false if public (solely based on cid)

module.exports = router;