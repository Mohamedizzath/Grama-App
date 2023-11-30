import React, { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import RefreshScreen from "./refresh";
import Home from "./home";
import LinearProgress from '@mui/joy/LinearProgress';
import Box from '@mui/joy/Box';
import Grid from "@mui/joy/Grid";
import { Typography } from "@mui/joy";
import { color } from "@mui/system";

function Index() {
  const { state } = useAuthContext();
  const [authenticatedAfterDelay, setAuthenticatedAfterDelay] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthenticatedAfterDelay(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="App">
        {authenticatedAfterDelay ? (
          state.isAuthenticated ? (
            <RefreshScreen />
          ) : (
            <Home />
          )
        ) : (
            <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
            <Grid container spacing={2} columns={16} style={{ margin: 0, alignItems: 'center' }} sx={{ flexGrow: 1 }}>
                <Grid xs={4}></Grid>
                <Grid xs={8} style={{padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
                    <LinearProgress color="main" determinate={false} size="lg" variant="solid" />
                    <Typography level="h3" color="main" marginTop={'20px'} >Loading..</Typography>
                </Grid>
                <Grid xs={4}></Grid>
            </Grid>
            </Box>

            
        )}
      </div>
    </>
  );
}

export default Index;
