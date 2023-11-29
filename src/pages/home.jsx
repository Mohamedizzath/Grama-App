import React, { useRef } from 'react';
import videoFile from '../assets/test-video.mp4';
import Header from "../components/Header";
import Grid from "@mui/joy/Grid";
import Container from '@mui/system/Container';
import ReactPlayer from 'react-player';
import {maxWidth } from '@mui/system';
import { useAuthContext } from "@asgardeo/auth-react";
import { Typography } from '@mui/material';
import Button from '@mui/joy/Button';

function Home() {
    const {signIn} = useAuthContext();
    const playerRef = useRef(null);
  return (
    <Container maxWidth={false} disableGutters style={{ height: '100vh',overflow: 'hidden'}}>
      <Header secured={false} />
      <Grid container spacing={0} columns={16} style={{height:'calc(100vh - 68px)'}}>
        <Grid  xs={16} sm={16} md={8} lg={8} backgroundColor='black'>
            <ReactPlayer ref={playerRef} url={videoFile} controls={false} playing={true}
            loop={true}  width={maxWidth} muted={true}  style={{ minHeight: '100%' }} />
        </Grid>
        <Grid  xs={16} sm={16} md={8} lg={8} style={{padding: '20px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ textAlign: 'center'}}>
                <Typography variant="h1" style={{marginBottom:'1px'}}>
                    Get Started
                </Typography>
                <Typography variant="body-sm">
                    Explore our platform and discover amazing features.
                </Typography>

                <div style={{ marginTop: '20px' }}>
                    <Button variant="filled" color="primary" style={{ backgroundColor: 'red', color: 'white', padding:'10px', borderRadius:'5px', width:'50%' }} 
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
