import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import WelcomeBoxLayout from './helpers/WelcomeBoxLayout';
import Link from '@mui/material/Link';

const backgroundImage = "https://img.freepik.com/free-photo/technological-futuristic-holograms-logistics-means-transport_23-2151663051.jpg"

export default function WelcomeBox() {
  return (
    <WelcomeBoxLayout
      sxBackground={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: '#7fc7d9', // Average color of the background image.
        backgroundPosition: 'center',
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: 'none' }}
        src={backgroundImage}
        alt="increase priority"
      />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        Welcome to SupplyTrust
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        sx={{ mb: 4, mt: { xs: 4, sm: 10 } }}
        display="block"
      >
        Your Decentralized Supply Chain Data Management Tool For Tracing, Tracking, And Trusting Supply Chains!
      </Typography>
      <Button
        color="primary"
        variant="contained"
        size="large"
        component="a"
        onClick={() => {
          alert("In this test version no registration is needed")
        }}
        sx={{ minWidth: 200 }}
      >
        Register
      </Button>
      <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
        See <Link color="inherit" href="https://github.com/sid030sid/supply-trust" underline="always">Documentation</Link>
      </Typography>
    </WelcomeBoxLayout>
  );
}