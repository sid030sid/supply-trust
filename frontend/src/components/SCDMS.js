import * as React from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import AddMetadataPopUpForm from './subcomponents/AddMetadataPopUpForm';
import { TextField } from '@mui/material';
import QrCodePopUp from './subcomponents/QrCodePopUp';

export default function SCDMS(props) {

    // state variables
    const [event, setEvent] = React.useState("producing")
    const [did, setDid] = React.useState("") //only needed when event === "producing" or "shipping"
    const [metadata, setMetadata] = React.useState([])
    const [material, setMaterial] = React.useState("")
    const [materials, setMaterials] = React.useState([])
    const [checked, setChecked] = React.useState(false)
    const [newController, setNewController] = React.useState("")
    const [credentialOfferUrl, setCredentialOfferUrl] = React.useState("")

    const handleQrCodePopUpClose = () => {
        setCredentialOfferUrl("")
    }

    // document using Cheqd's credential serivce API which creates DIDs in internal secret mode
    const documentWithCheqdCredentialService = async () => {

        //TODO in future: if did is given by user check if it exits and if he or she is controller and if he or she is registered supply chain entity
        
        //retrieve all even info and put it in one json obj
        const eventInformationObj = {
            "event":event,
            "metadata":Object.fromEntries(metadata)
        }

        //uplaod file to ipfs
        const res = await axios.post(`/api-ipfs/upload?private=${checked}`, {data : eventInformationObj})

        //get ipfs path
        const cid = res.data

        //alert for better UX
        alert("Your supply chain event metadata is stored as CID: "+cid+"\nPlease wait for the supply chain event to be fully documented with did:cheqd.\nThis may take a while, please wait for the next verification and do not refresh the web app in the meantime.")

        
        const serviceEndpoints = []

        /*
        //if checked true, then ipfs file with event metadata is private and service endpoint for requesting access to ipfs file must be included in did doc
        if(checked && accessRequestUrl !== ""){
            if(event === "producing" | event === "manufacturing"){
                serviceEndpoints.push(
                    {
                        "idFragment": "requestAccessUrl",
                        "type": "LinkedDomains",
                        "serviceEndpoint": [accessRequestUrl]
                    }
                )
            }else{
                serviceEndpoints.push(
                    {
                        "id": did+"#requestAccessUrl",
                        "type": "LinkedDomains",
                        "serviceEndpoint": [accessRequestUrl]
                    }
                )
            }
        }*/
        let endpointSuffix = "ipfs"
        if(checked){
            endpointSuffix = "private-ipfs"
        }

        // create did or update did depending on supply chain event
        let workingDid = did
        if(event === "producing"){

            // create endpoints for services in did doc
            serviceEndpoints.push(
                {
                    "idFragment": endpointSuffix,
                    "type": "LinkedDomains",
                    "serviceEndpoint": [cid]
                }
            )

            // create did
            const didCreationRes = await axios.post("/api-credential-service/create", {services:serviceEndpoints})

            if(didCreationRes){
                workingDid = didCreationRes.data.did
                alert("Your newly produced supply chain item is identified as "+workingDid+". Verify by performing tracing and tracking.")
            }
        }else{
            if(event === "shipping"){
                // check if controller is using app or make request and let error --> TODO in future

                // get current did document--> TODO in future: retrieve did doc immediately when value of state variable did changes
                const currentDidResObj = await axios.get("https://resolver.cheqd.net/1.0/identifiers/"+did, {headers:{"Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"}})
                var currentDidDoc = currentDidResObj.data.didDocument

                /* update local did doc of to be updated did for shipping event
                    1. update service with id: "...#ipfs"
                    2. update controller to be newController --> TODO in future (once Cheqd bug fixed)
                */
                serviceEndpoints.push({
                    "id": did+"#"+endpointSuffix,
                    "type": "LinkedDomains",
                    "serviceEndpoint": [
                      cid                        
                    ]
                  })
                currentDidDoc.service = serviceEndpoints // update endpoint of service with id: "...#ipfs"

                // get verfication method of newController
                    //const didResObjNewController = await axios.get("https://resolver.cheqd.net/1.0/identifiers/"+newController, {headers:{"Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"}})
                    //const didDocNewController = didResObjNewController.data.didDocument
                    //const verifMethodNewController = didDocNewController.verificationMethod[0] // TODO in future: make code more robust by looking for verification method with suffix "#key-1" in id value of verification method
                    //verifMethodNewController.id = currentDidDoc.verificationMethod[0].id // keep the current id of the only verification method

                // perform update of controller
                currentDidDoc.controller = [newController] // change controller to newController 
                    //currentDidDoc.verificationMethod = [verifMethodNewController] //replace verificationMethod with the one given in did doc of newController
                    //console.log(currentDidDoc)

                // prepare data for request to backend
                const data = {
                    did: did,
                    service: '',
                    verificationMethod: '',
                    authentication: '',
                    didDocument: currentDidDoc // this is locally updated version of the current did doc
                };

                // update did by setting local did doc as the new did doc via credential service API
                const didCreationRes = await axios.post(
                    '/api-credential-service/update', 
                    data
                )

                if(didCreationRes){
                    alert("Successful documentation of shipping event in the newest DID Document version of "+ did + ". Verify by performing tracing and tracking.")
                }
            }else{
                if(event === "receiving"){
                    // get current did document--> TODO in future: retrieve did doc immediately when value of state variable did changes
                    const currentDidResObj = await axios.get("https://resolver.cheqd.net/1.0/identifiers/"+did, {headers:{"Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"}})
                    var currentDidDoc = currentDidResObj.data.didDocument

                    /* update local did doc of to be updated did for receiving event
                        1. update service with id: "...#ipfs"
                    */
                    serviceEndpoints.push(
                        {
                            "id": did+"#"+endpointSuffix,
                            "type": "LinkedDomains",
                            "serviceEndpoint": [
                                cid                        
                            ]
                        }
                    )
                    currentDidDoc.service = serviceEndpoints // update endpoint of service with id: "...#ipfs"
                    

                    // prepare data for request to backend
                    const data = {
                        did: did,
                        service: '',
                        verificationMethod: '',
                        authentication: '',
                        didDocument: currentDidDoc // this is locally updated version of the current did doc
                    };

                    // update did by setting local did doc as the new did doc via credential service API
                    const didCreationRes = await axios.post(
                        '/api-credential-service/update', 
                        data
                    )

                    if(didCreationRes){
                        alert("Successful documentation of receiving event in the newest DID Document version of "+ did + ". Verify by performing tracing and tracking.")
                    }
                }else{ //case of manufacturing

                    // create service endpoints to reference metadata stored on IPFS
                    serviceEndpoints.push(
                        {
                            "idFragment": endpointSuffix,
                            "type": "LinkedDomains",
                            "serviceEndpoint": [cid]
                        }
                    )

                    // add material endpoints which store DID of materials used for manufactured product
                    var idx = 0
                    for(const _material of materials){ 
                        serviceEndpoints.push(
                            {
                                "idFragment": "material-"+idx,
                                "type": "LinkedDomains",
                                "serviceEndpoint": [_material]  // id of did respresenting material used for manufacturing
                            }
                        )
                        idx++
                    }

                    // create did
                    const didCreationRes = await axios.post("/api-credential-service/create", {services: serviceEndpoints})

                    if(didCreationRes){
                        workingDid = didCreationRes.data.did
                        alert("Your newly manufactured supply chain item is identified as "+workingDid+". Verify by performing tracing and tracking.")
                    }
                }
            }
        }

        // if supply chain event metadata file in ipfs is private, then SupplyTrust issues VC using pre-authorized code flow folowing OID4VCI
        if(checked){

            // get current did document version
            const workingDidCurrentResObj = await axios.get("https://resolver.cheqd.net/1.0/identifiers/"+workingDid, {headers:{"Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"}})
            const workingDidDocumentVersion = workingDidCurrentResObj.data.didDocumentMetadata.versionId
            
            // create credential offer
            const credentialOfferRes = await axios.post("/api-issuer/offer", {
                did: workingDid,
                didDocumentVersion: workingDidDocumentVersion,
                cid: cid, 
                credentialType: "PrivateIpfsOwnershipCredential"
            })

            // if credential offer created, then pop-up QR code for user to claim VC offer
            if(credentialOfferRes){
                setCredentialOfferUrl(credentialOfferRes.data)
            }
        }
    }

    return (
        <Container component="main">
        <Box
            sx={{
            marginTop: 8,
            marginBottom: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
                Document Supply Chain
            </Typography>
            <p>Document the supply chain events of your supply chain items using did:cheqd.</p>
            <Box sx={{ mt: 1 }}>
                <FormControl fullWidth sx={{marginTop: 4}}>
                    <InputLabel id="event-selector">Event</InputLabel>
                    <Select
                        id="event-selector"
                        value={event}
                        label="Event"
                        onChange={(e)=>setEvent(e.target.value)}
                    >
                        <MenuItem value={"producing"}>Producing</MenuItem>
                        <MenuItem value={"shipping"}>Shipping</MenuItem>
                        <MenuItem value={"receiving"}>Receiving</MenuItem>
                        <MenuItem value={"manufacturing"}>Manufacturing</MenuItem>
                    </Select>
                    <FormGroup>
                        <FormControlLabel 
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={(e)=>setChecked(e.target.checked)}
                                />
                            } 
                            label="Document privately?" 
                        />
                    </FormGroup>
                    {/*
                        checked?
                            <TextField
                                margin="normal"
                                fullWidth
                                id="Access Request URL"
                                label="Access Request URL"
                                name="Access Request URL"
                                value={accessRequestUrl}
                                onChange={(e) => setAccessRequestUrl(e.target.value)}
                                helperText="Provide URL for others to reach you to request access to private supply chain event metadata."
                            />
                        :
                        ""
                    */}
                </FormControl>
                {
                    event === "shipping" | event === "receiving" ?
                    <TextField
                        margin="normal"
                        fullWidth
                        id="DID"
                        label="DID"
                        name="DID"
                        value={did}
                        onChange={(e) => setDid(e.target.value)}
                        helperText="Scan the QR code of your supply chain item to get its DID"
                    />
                    :
                    ""
                }
                {
                    event === "shipping" ?
                    <TextField
                        margin="normal"
                        fullWidth
                        id="New Controller"
                        label="New controller"
                        name="New Controller"
                        value={newController}
                        onChange={(e) => setNewController(e.target.value)}
                        helperText="DID of the new owner of the supply chain item"
                    />
                    :
                    ""
                }
                {
                    event === "manufacturing" ? 
                    <Box sx={{display: 'flex', flexDirection: 'column', marginTop: 4}}>
                            <Typography component="h1" variant="h6">
                                List materials used for manufacturing!
                            </Typography>
                            <Box>
                                {
                                    materials?.length > 0 ?
                                        
                                        <Box>
                                            {
                                                materials.map((item, idx) =>(
                                                    <Box key={idx}>
                                                        <Chip label={item} variant="outlined" onDelete={()=>setMaterials([...materials.slice(0, idx), ...materials.slice(idx + 1)])} />
                                                    </Box>
                                                ))
                                            }
                                        </Box>
                                        
                                    :
                                    ""
                                }
                                <Box>
                                    <TextField 
                                        label="Material"
                                        margin="normal"
                                        fullWidth
                                        value={material}
                                        onChange={(e) => setMaterial(e.target.value)}
                                        helperText="DID of material used for manufacturing"
                                    ></TextField>
                                    <Button onClick={()=>{setMaterials([...materials, material]); setMaterial("")}}>Add material</Button>
                                </Box>  
                            </Box> 
                        </Box>
                    :
                    ""
                }
                {
                    (event !== "" & (event === "producing" | event === "manufacturing")) | (did !== "") ?
                        <Box sx={{display: 'flex', flexDirection: 'column', marginTop: 4}}>
                            <Typography component="h1" variant="h6">
                                Describe your event!
                            </Typography>
                            <Box>
                                {
                                    metadata?.length > 0 ?
                                        
                                        <Box>
                                            {
                                                metadata.map((item, idx) =>(
                                                    <Box key={idx}>
                                                        <Chip key={idx} label={item[0] + " : " + item[1]} variant="outlined" onDelete={()=>setMetadata([...metadata.slice(0, idx), ...metadata.slice(idx + 1)])} />
                                                    </Box>
                                                ))
                                            }
                                        </Box>
                                        
                                    :
                                    ""
                                }  
                                <AddMetadataPopUpForm addEventInfo={(eventInfo)=>setMetadata([...metadata, eventInfo])}></AddMetadataPopUpForm>
                            </Box>
                            {
                                metadata?.length > 0 ?
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={documentWithCheqdCredentialService}
                                    >
                                        Document
                                    </Button>
                                :
                                ""
                            }   
                        </Box>
                    :
                    ""
                }
            </Box>
        </Box>
        <QrCodePopUp open={credentialOfferUrl? true : false} handleClose={handleQrCodePopUpClose} url={credentialOfferUrl}></QrCodePopUp>
        </Container>
    );
}