import { Box, Typography, Button, Chip, Divider } from "@mui/joy";
import { useAuthContext } from "@asgardeo/auth-react";
import React, { useEffect } from "react";

function subHeader(){
    const { state, getDecodedIDToken } = useAuthContext();
    
    useEffect(() => {
        const displayIDTokenInfo = async () => {
            try {
                const decodedIDToken = await getDecodedIDToken();
                console.log('Decoded ID Token:', decodedIDToken);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        displayIDTokenInfo();
    }, []);
    
    return(
        <Box>
            <Box display="flex" justifyContent="start" alignItems="center">
                <Typography level="h2" color="black">Hii! {state.displayName}</Typography> 
            </Box>
            <Chip color="primary" size="sm" variant="soft" sx={{ marginTop: "4px" }}>Email - {state.email}</Chip>
            <Divider orientation="horizontal" color="main" style={{marginTop:'10px', marginBottom:'10px'}} />
        </Box>
    );
}
export default subHeader;