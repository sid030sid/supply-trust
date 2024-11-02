import {Drawer, List, ListItemButton} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Logo from '../../favicon.ico'

function DrawerMenu(props) {

    // object for changing path in browser for user
    const navigate = useNavigate();
    
    return (
        <Drawer
            className='App-text-bold'
            anchor="left"
            open={props.open}
            onClose={props.closeDrawerMenu}
        >
            <List>
                <ListItemButton onClick={()=>{props.closeDrawerMenu(); navigate("/")}}>
                    Home
                </ListItemButton>
                <ListItemButton onClick={()=>{props.closeDrawerMenu(); navigate("/trace-and-track")}}>
                    Trace and Track
                </ListItemButton>
                <ListItemButton onClick={()=>{props.closeDrawerMenu(); navigate("/document")}}>
                    Document Supply Chain
                </ListItemButton>
                <ListItemButton onClick={()=>{props.closeDrawerMenu(); navigate("/manage")}}>
                    Manage Documents
                </ListItemButton>
            </List>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 'auto',
                    mb: 2,
                    p: 2,
                    textAlign: 'center',
                }}
            >
                <img src={Logo} alt="logo" style={{ width: 40, height: 40 }} />
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    SupplyTrust
                </Typography>
            </Box>
        </Drawer>
    );
}

export default DrawerMenu;