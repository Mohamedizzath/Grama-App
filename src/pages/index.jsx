import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuthContext } from "@asgardeo/auth-react";
import RefreshScreen from "./refresh";
import Home from "./home";
import LinearProgress from '@mui/joy/LinearProgress';
import Box from '@mui/joy/Box';
import Grid from "@mui/joy/Grid";

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
      <Header secured={false} />
      <div className="App">
        {authenticatedAfterDelay ? (
          state.isAuthenticated ? (
            <RefreshScreen />
          ) : (
            <Home />
          )
        ) : (
            <Box sx={{ height: '88vh', display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
            <Grid container spacing={2} columns={16} style={{ margin: 0, alignItems: 'center' }} sx={{ flexGrow: 1 }}>
                <Grid xs={4}></Grid>
                <Grid xs={8} style={{ backgroundColor: 'rgba(255, 118, 27, 0.9)', padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
                    <LinearProgress color="neutral" determinate={false} size="lg" variant="soft" />
                    <h1 style={{ marginTop: '20px', fontFamily: 'Arial, sans-serif', fontSize: '24px', fontWeight: 'bold', color:'white' }}>Loading...</h1>
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
