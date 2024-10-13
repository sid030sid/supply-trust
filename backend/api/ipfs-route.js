const router = require('express').Router();
require("dotenv").config();

const {PinataSDK: PinataIpfsApi} = require("pinata-web3");
const {PinataSDK: PinataFileApi} = require("pinata");

const ipfsApi = new PinataIpfsApi({
  pinataJwt: process.env.PINATA_API_JWT,
  pinataGateway: process.env.PINATA_API_GATEWAY,
});

const fileApi = new PinataFileApi({
    pinataJwt: process.env.PINATA_API_JWT,
    pinataGateway: process.env.PINATA_API_GATEWAY,
  });

router.route('/upload').post(async (req, res)=>{
    try {

        console.log("private? ", req.query.private)
        if(req.query.private===""){
            res.send("ERROR - Invalid query: mising info on private in query")
        }

        if(req.body.data===""){
            res.send("ERROR - Invalid query: missing data in body")
        }

        console.log("data", req.body.data)

        const file = new File([JSON.stringify(req.body.data)], { type: "text/plain" });

        // upload file to private or public ipfs depending on configuration set by user in query 
        let upload;
        let cid;
        if(req.query.private===true){
            // check if requester is authorized to upload to private ipfs?
            // if not, send error message
                //TODO

            // else, upload file to private ipfs
            upload = await fileApi.upload.file(file);
            //upload = await ipfsApi.pinJSONToIPFS(req.body.data)
            cid = upload.cid
            console.log("upload of private file", upload);
        }else{
            //upload file to public ipfs
            //upload = await ipfsApi.upload.file(req.body.data);
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

router.route('/download/:cid').get(async (req, res)=>{
    try {
        const cid = req.params.cid

        if(cid===""){
            res.send("ERROR - Invalid query: missing cid in params")
        }
        
        let data;
        // download file from public ipfs
            // TODO: think about whether this is actually necessary... i do not believe so as the link will be directly given in frontend
        data = await ipfsApi.gateways.get(cid);
        if(data === ""){ // if not found, check private ipfs
            data = await fileApi.gateways.get(cid);
            console.log("data from private ipfs", data)

            const url = await fileApi.gateways.createSignedURL({
                cid: cid,
                expires: 1800,
            })
            console.log(url)
        }

        
        // if found, check if requester is authorized to download from private ipfs
        // if not, send error message
        // else, forward file to private ipfs
        //TODO: VC based access system!
        res.send(data)
    } catch (error) {
        console.log(error)
    }
})

//TODO: endpoint that returns true if ipfs file is private, false if public (solely based on cid)

module.exports = router;