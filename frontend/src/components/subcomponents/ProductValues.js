import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button } from '@mui/material';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

function ProductValues() {

    const navigate = useNavigate();
  return (
    <Box
      component="section"
      sx={{ display: 'flex', overflow: 'hidden' }}
    >
      <Container sx={{ mt: 15, mb: 30, display: 'flex', position: 'relative' }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
                <VisibilityIcon sx={{ fontSize: 80 }} />
                <Button variant="contained" onClick={()=>{navigate("/trace-and-track")}} sx={{ my: 5 }}>
                Trace and Track
                </Button>
              <Typography variant="h5">
                    Trace and track your supply chain items based on their Decentralized Identifier.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
                <FolderIcon sx={{ fontSize: 80 }} />
                <Button variant="contained" onClick={()=>{navigate("/document")}} sx={{ my: 5 }}>
                    Document Supply Chain
                </Button>
              <Typography variant="h5">
                Document your supply chain items and activities to acievey tracking, tracing, and trust in your supply chain.
              </Typography>
                
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <NoteAltIcon sx={{ fontSize: 80 }} />
              <Button variant="contained" onClick={()=>{navigate("/manage")}} sx={{ my: 5 }}>
                Manage Documents
            </Button>
              <Typography variant="h5">
                Manage your private Supply Chain Documents and share them with others.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProductValues;