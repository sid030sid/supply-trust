const router = require('express').Router();
const axios = require('axios')
const qs = require('qs');
require("dotenv").config();


// middleware which enables http requests to bypass CORS policy issue
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// endpoint for creating a DID
router.route('/create').post(async (req, res)=>{
    try {
        // get data from request body
        const services = req.body.services

        // prepare API request for DID creation
        const token = process.env.CHEQD_CREDENTIAL_SERVICE_TOKEN
        const url = 'https://studio-api.cheqd.net/did/create';
        //const data = 'network=testnet&identifierFormatType=uuid&verificationMethodType=Ed25519VerificationKey2020&service='+encodeURIComponent(JSON.stringify(services))+'&key=&%40context=https%3A%2F%2Fwww.w3.org%2Fns%2Fdid%2Fv1'
        const data = {
            network: 'testnet',
            identifierFormatType: 'uuid',
            verificationMethodType: 'Ed25519VerificationKey2020',
            service: JSON.stringify(services),  //encodeURIComponent(JSON.stringify(services))
            key: '',
            '@context': 'https://www.w3.org/ns/did/v1',
        };
        const encodedData = qs.stringify(data);
        const headers = {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-api-key': token
        };

        // create DID using Credential service API offered by Cheqd
        const resCreateDid = await axios.post(url, encodedData, { headers })
        
        // send did document of newly created did to frontend and store it in db
        if(resCreateDid){
            
            // send did doc of new did to frontend
            res.send(resCreateDid.data)
        }else{
            res.send("ERROR: DID create")
        }
    } catch (error) {
        error.response ? console.error(error.response.data) : console.error(error)
    }
})

// endpoint for updating a DID 
router.route('/update').post(async (req, res)=>{
    try {
        // get req body data 
        const data = {
            did: req.body.did,
            service: req.body.service,
            verificationMethod: req.body.verificationMethod,
            authentication: req.body.authentication,
            didDocument: req.body.didDocument            
        }

        // prepare API request for DID update
        const token = process.env.CHEQD_CREDENTIAL_SERVICE_TOKEN
        const url = 'https://credential-service.cheqd.net/did/update';
        const headers = {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-api-key': token
        };

        // create DID using Credential service API offered by Cheqd
        const resUpdateDid = await axios.post(
            url, 
            data, 
            { headers }
        )
        
        // send did document of updated did to frontend
        if(resUpdateDid){
            // send to frontend
            res.send(resUpdateDid.data)
        }else{
            res.send("ERROR: DID update")
        }
    } catch (error) {
        error.response ? console.error(error.response.data) : console.error(error)
    }
})

module.exports = router;