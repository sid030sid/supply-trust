import * as React from 'react';
import { useParams, useNavigate, useLocation} from 'react-router-dom';
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

const useQuery = () => {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const EventMetadata = () => {

    // get cid of ipfs file from params
    const { cid } = useParams();

    // get query from url
    const query = useQuery();

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

            const privateAccess = query.get("private") === "true" ? true : false

            // if access is private, get oid4vp url from verifier service and display qr code for OID4VP
            if(privateAccess){
                const requestOid4vpUrl = await axios.get("/api-verifier/generate-vp-request");

                // update url for user to scan and initiage OID4VP
                setOid4vpUrl(requestOid4vpUrl.data.vpRequest) //if private, verify vc_jwt of user and then show data to user
                
                //websocket connection to get token from verifier service
                const state = requestOid4vpUrl.data.state
                const ws = new WebSocket(`wss://${process.env.REACT_APP_BASE_URL}/ws?state=${state}`);
                ws.onmessage = async (event) => {
                    const data = JSON.parse(event.data);
                    const token = data.token;
                    if (token) {
                        //download data from private ipfs
                        const res = await axios.get(`/api-ipfs/download-private-ipfs/${cid}`, { headers: {"Authorization" : `Bearer ${token}`} });

                        //if file found show content to user
                        console.log("private ipfs download", res)
                        if(res.data?.event !== null){
                            setOid4vpUrl("")
                            setEventMetadata(res.data)
                        }else{
                            alert("Private IPFS file not found")
                        }
                    }else{
                        alert("Access token for private IPFS not found")
                    }
                };
                ws.onclose = () => {
                    console.log("WebSocket connection closed");
                };
            }else{
                //download file from public ipfs
                const res = await axios.get(`/api-ipfs/download-public-ipfs/${cid}`);
                console.log("public ipfs res download", res)

                //if file found show content to user
                if(res.data?.data?.event !== null){
                    setEventMetadata(res.data.data)
                }else{
                    alert("Public IPFS file not found")
                }
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
                <div>
                    <h2>Supply chain event: </h2>
                    <pre>{eventMetadata?.event}</pre>
                    <h2>Event metadata:</h2>
                    <pre>{JSON.stringify(eventMetadata?.metadata)}</pre>
                </div>
            :
            oid4vpUrl?
                <div>
                    <h2>Supply chain event is private.</h2>
                    <p>Please present Private IPFS Ownership Credential so that SupplyTrust can verify your access right for the event metadata stored in the private IPFS powered by Pinata.</p>
                    <QRCode value={oid4vpUrl}/>
                    <p>NOTE: Ensure that you only have one Private IPFS Ownership Credential in your wallet before connecting to SupplyTrust for OID4VP.</p>
                </div>
                :
                ""
            }
        </div>
    );
  };
  
export default EventMetadata;