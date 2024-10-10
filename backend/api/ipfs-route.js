const router = require('express').Router();
require("dotenv").config();

const pinataIpfsApi = require("pinata-web3");

const ipfsApi = pinataIipfsApi({
  pinataJwt: process.env.PINATA_API_JWT,
  pinataGateway: process.env.PINATA_API_GATEWAY,
});

router.route('/upload').post(async (req, res)=>{
    try {
        const privateUpload = req.query.private //?private=true or false in query url

        // upload file to private or public ipfs depending on configuration set by user in query 
        if(req.query.private===true){
            //TODO
        }else{
            if(req.query.private===false){
                //TODO
            }else{
                //TODO return error
            }
        }
        
        // get cid from response

        // send response to frontend
        if(ipfsLink !== ""){
            res.send(ipfsLink)
        }else{
            res.send("ERROR")
        }
        
    } catch (error) {
        console.log(error)
    }
})

router.route('/download').post(async (req, res)=>{
    try {
        //TODO: VC based access system!
        
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;