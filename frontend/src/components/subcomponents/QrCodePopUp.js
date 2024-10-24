import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import QRCode from "react-qr-code";

export default function QrCodePopUp(props) {

    return (
        <React.Fragment>
            <Dialog open={props.open} onClose={props.handleClose}>
                <DialogTitle>Claim Verifable Credential for Private IPFS File</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Claim your Verifiable Credenital for the private IPFS file containing the supply chain event metadata you recorded. 
                        This Verifiable Credential attests your ownership of the content and authorizeses you to issue Verifiable Credentials to others so that they can access the private content as well.
                    </DialogContentText>
                    <br></br>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <QRCode value={props.url}/>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
