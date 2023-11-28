import React from "react";
import LinearProgress from '@mui/joy/LinearProgress';
import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';
import Header from "../components/Header";

function RefreshScreen() {
    return (
        <>
            <Header secured={false} />
            <Box backgroundColor="#FF761B" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
                <Grid container spacing={2} columns={16} style={{ margin: 0, alignItems: 'center' }} sx={{ flexGrow: 1 }}>
                    <Grid xs={4}></Grid>
                    <Grid xs={8} style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
                        <LinearProgress color="neutral" determinate={false} size="lg" variant="soft" />
                        <h1 style={{ marginTop: '20px', fontFamily: 'Arial, sans-serif', fontSize: '24px', fontWeight: 'bold' }}>Loading...</h1>
                    </Grid>
                    <Grid xs={4}></Grid>
                </Grid>
            </Box>
        </>
    );
}

export default RefreshScreen;
