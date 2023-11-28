import React from "react";
import LinearProgress from '@mui/joy/LinearProgress';
import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';

function RefreshScreen() {
    return (
        <Box style={{ backgroundColor: 'orange', height: '100vh', display: 'flex', justifyContent: 'center'}} sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} columns={16} style={{ margin: 0, alignItems: 'center' }} sx={{ flexGrow: 1 }}>
                <Grid xs={4}></Grid>
                <Grid xs={8} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                    <LinearProgress color="neutral" determinate={false} size="lg" variant="soft" />
                    <h1 style={{ marginTop: '20px', fontFamily: 'Arial, sans-serif', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Loading...</h1>
                </Grid>
                <Grid xs={4}></Grid>
            </Grid>
        </Box>
    );
}

export default RefreshScreen;
