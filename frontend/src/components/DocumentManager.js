import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Button } from '@mui/material';

const DocumentManager = () => {
    return(
      <div>
        <Typography component="h1" variant="h5" sx={{marginTop: 8}}>
          Manage Documents
        </Typography>
        <p>Mange your private supply chain documents stored in the private IPFS powered by Pinata.</p>
        <Box
          component="section"
          sx={{ display: 'flex', overflow: 'hidden' }}
        >
          <Container sx={{ mt: 15, mb: 30, display: 'flex', position: 'relative' }}>
            <Grid container spacing={5}>
              <Grid item xs={12} md={6}>  {/* Half-width on medium and full-width on small */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <FactCheckIcon sx={{ fontSize: 80 }} />
                  <Button variant="contained" onClick={() => { alert("This feature is not included in the test version!") }} sx={{ my: 5 }}>
                    Document Manager
                  </Button>
                  <Typography variant="h5">
                    View or remove your private supply chain documents.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>  {/* Half-width on medium and full-width on small */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <VpnKeyIcon sx={{ fontSize: 80 }} />
                  <Button variant="contained" onClick={() => { alert("This feature is not included in the test version!") }} sx={{ my: 5 }}>
                    Access Manager
                  </Button>
                  <Typography variant="h5">
                    Issue or revoke Verifiable Credentials for accessing your private supply chain documents.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
        {/*<div>
            Functionalities of the Private IPFS Access Manager:
            <li>Issue Private IPFS Access Credentials to others</li>
            <li>Revoke your issued Private IPFS Access Credentials</li>
            <li>View your private IPFS Files and their authorized accessors</li>
            <li>View your issued Private IPFS Access Credentials and their revocation status</li>
        </div>*/}
      </div>
    );
  };
  
export default DocumentManager;