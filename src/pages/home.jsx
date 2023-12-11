import React, { useRef } from 'react';
import videoFile from '../assets/introduction-3.mp4';
import Header from "../components/Header";
import Grid from "@mui/joy/Grid";
import Container from '@mui/system/Container';
import ReactPlayer from 'react-player';
import { useAuthContext } from "@asgardeo/auth-react";
import { Typography } from '@mui/joy';
import Button from '@mui/joy/Button';

function Home() {
    const {signIn} = useAuthContext();
    const playerRef = useRef(null);
  return (
    <Container maxWidth={false} disableGutters style={{ height: '100vh',overflow: 'hidden'}}>
      <Header secured={false} />
      <Grid container spacing={0} columns={16} style={{height:'calc(100vh - 68px)'}}>
        <Grid  xs={16} sm={16} md={8} lg={8}>
            <ReactPlayer ref={playerRef} url={videoFile} controls={false} playing={true}  
            loop={true} muted={true}  style={{ minHeight: '90%', width: 'auto', 
            transform: 'scaleX(1.22)',
            // '@media (max-width: 600px)': {
            //     transform: 'scaleX(1)', // xs screens
            // },
            // '@media (min-width: 601px) and (max-width: 960px)': {
            //     transform: 'scaleX(1.15)', // sm screens
            // },
            // '@media (min-width: 961px) and (max-width: 1280px)': {
            //     transform: 'scaleX(1.18)', // md screens
            // },
            }} 
            />
        </Grid>
        <Grid  xs={16} sm={16} md={8} lg={8} style={{padding: '20px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ textAlign: 'center'}}>
                <Typography level="h1" fontSize={'40px'} style={{marginBottom:'1px'}} color='main'>
                    Get Started
                </Typography>
                <Typography level="body-sm" fontSize={'15px'} color='neutral' >
                    Explore our platform and discover amazing features.
                </Typography>

                <div style={{ marginTop: '20px' }}>
                    <Button variant="solid" color="main" style={{padding:'10px', borderRadius:'5px', width:'50%' }} 
                    onClick={() => signIn()}>Log In
                    </Button>
                </div>
            </div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
