import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

export default function TracingTable(props) {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell align="right">Event</TableCell>
            <TableCell align="right">DID document version</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.events.map((event) => (
            <TableRow
              key={event.didResolverURL}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="event">
                {event.didDocumentMetadata.updated ? event.didDocumentMetadata.updated : event.didDocumentMetadata.created}
              </TableCell>
              <TableCell align="right">
                <Link href={`trace-and-track/${event.service.find(i=>{return(i.id.includes("ipfs"))})?.serviceEndpoint[0]}?private=${event.service.find(i=>{return(i.id.includes("private-ipfs"))})?.serviceEndpoint?.length > 0 ?true:false}`}>
                    See details
                    {event.service.find(i=>{return(i.id.includes("private-ipfs"))})?.serviceEndpoint?.length > 0 ?  
                      <LockIcon/>
                    : ""
                  }
                </Link>
              </TableCell>
              <TableCell align="right">
                <Link target="_blank" rel="noreferrer" href={event.didResolverURL}>
                    {event.didResolverURL.match(/versionId=([^&]+)/)[1]}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
