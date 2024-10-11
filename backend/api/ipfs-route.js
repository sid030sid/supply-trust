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
        if(req.query.private===""){
            res.send("ERROR - Invalid query: mising info on private in query")
        }

        if(req.body.data===""){
            res.send("ERROR - Invalid query: missing data in body")
        }

        const file = new File([JSON.stringify(req.body.data)], { type: "text/plain" });

        // upload file to private or public ipfs depending on configuration set by user in query 
        let upload;
        if(req.query.private===true){
            // check if requester is authorized to upload to private ipfs?
            // if not, send error message
                //TODO

            // else, upload file to private ipfs
            upload = await fileApi.upload.file(file);
            //upload = await ipfsApi.pinJSONToIPFS(req.body.data)
            console.log(upload);
        }else{
            //upload file to public ipfs
            //upload = await ipfsApi.upload.file(req.body.data);
            upload = await ipfsApi.upload.file(file);
        }
        
        // get cid from response
        const cid = upload.cid

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

router.route('/download/:cid').post(async (req, res)=>{
    try {
        const cid = req.params.cid

        if(cid===""){
            res.send("ERROR - Invalid query: missing cid in params")
        }
        

        // download file from public ipfs
            // TODO: think about whether this is actually necessary... i do not believe so as the link will be directly given in frontend

        // if not found, check private ipfs
        // if found, check if requester is authorized to download from private ipfs
        // if not, send error message
        // else, forward file to private ipfs
        //TODO: VC based access system!
        
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;