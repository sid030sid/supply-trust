import * as React from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import QRCode from "react-qr-code";
import { CID } from 'multiformats/cid'

// helper function
const isValidCid = (cidString) => {
    try {
        CID.parse(cidString);
        return true; // CID is valid
    } catch (err) {
        return false; // Invalid CID
    }
}

const EventMetadata = () => {

    // get cid of ipfs file from params
    const { cid } = useParams();

    // state variables
    const [eventMetadata, setEventMetadata] = React.useState(null)
    const [oid4vpUrl, setOid4vpUrl] = React.useState(null)
    const [verified, setVerified] = React.useState(false) //this is set to true after oid4vp is performed successfully

    const navigate = useNavigate()

    const onMountFunction = async () => {
        try{
            // if cid not valid, redirect to NoPage
            if(!isValidCid(cid)){
                navigate("/error")
                return
            }

            //download file from private or public ipfs
            const res = await axios.get(`/api-ipfs/download/${cid}`);

            //if public, show event meta data to user
            if(res.data?.data?.event !== null){
                setEventMetadata(res.data.data)
            }else{
                setEventMetadata("private") //if private, verify vc_jwt of user and then show data to user

                //get oid4vp url from verifier service
                    //TODO: call endpoint and then call setOid4vpUrl OR navigate to "trace-and-track/cid/verify" page!!! which redirects after successfull oid4vp back to this page with "trace-and-track/cid"??? --> no to complicated
            }

            
        }catch(e){
            console.log(e)
        }
    }

    //on mount: try to retrieve supply chain event metadata
    React.useEffect( () => {
        onMountFunction()
    }, []);


    return(
        <div>
            {eventMetadata?
                eventMetadata === "private" & oid4vpUrl?
                    <div>
                        <h1>Supply chain event metadata stored in IPFS file {cid} is private. Please present VC so that SupplyTrust can verify your access right for private IPFS file: {cid}</h1>
                        <QRCode value={oid4vpUrl}/>
                    </div>
                :
                <div>
                    <h2>Supply chain event: </h2>
                    <pre>{eventMetadata?.event}</pre>
                    <h2>Event metadata:</h2>
                    <pre>{JSON.stringify(eventMetadata?.metadata)}</pre>
                </div>
            :
                ""
            }
        </div>
    );
  };
  
export default EventMetadata;