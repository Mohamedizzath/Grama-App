import React, { useEffect, useState } from "react";
import LinearProgress from '@mui/joy/LinearProgress';
import Box from '@mui/joy/Box';
import Grid from "@mui/joy/Grid";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "@asgardeo/auth-react";

function RefreshScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { getAccessToken, signIn } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.asgardeo.io/t/wso2khadijah/oauth2/userinfo', {
          headers: {
            Authorization: `Bearer ${await getAccessToken()}`
          }
        });

        if (response.ok) {
          const json = await response.json();
          const fetchedRole = json.application_roles;
          console.log(fetchedRole);

          if (!fetchedRole) {
            navigate('/citizen');
          } else if (fetchedRole === "gramaSewaka") {
            navigate('/grama-sewaka');
          }
        } else {
          console.error('Error:', response.statusText);
          signIn();
        }
      } catch (error) {
        console.error('Error:', error);
        signIn();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <>
      {loading ? (
            <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
            <Grid container spacing={2} columns={16} style={{ margin: 0, alignItems: 'center' }} sx={{ flexGrow: 1 }}>
                <Grid xs={4}></Grid>
                <Grid xs={8} style={{ backgroundColor: 'rgba(255, 118, 27, 0.9)', padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
                    <LinearProgress color="neutral" determinate={false} size="lg" variant="soft" />
                    <h1 style={{ marginTop: '20px', fontFamily: 'Arial, sans-serif', fontSize: '24px', fontWeight: 'bold', color:'white' }}>Loading...</h1>
                </Grid>
                <Grid xs={4}></Grid>
            </Grid>
            </Box>
      ) : null }
    </>
  );
}

export default RefreshScreen;
