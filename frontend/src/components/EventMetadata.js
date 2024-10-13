import * as React from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
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

    const [eventMetadata, setEventMetadata] = React.useState(null)

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

            }

            //if private, verify vc_jwt of user and then show data to user
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
                <div>
                    <h2>{eventMetadata?.event}</h2>
                    <h2>{JSON.stringify(eventMetadata?.metadata)}</h2>
                </div>
            :
                <div>
                    <h1>Supply chain event metadata stored in IPFS file {cid} is private. Please present VC so that SupplyTrust can verify your access right for private IPFS file: {cid}</h1>
                    <h2>TODO: show QR code for verifiable presentation</h2>
                </div>
            }
        </div>
    );
  };
  
export default EventMetadata;