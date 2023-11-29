import { useAuthContext } from "@asgardeo/auth-react";
import { Box, Chip } from "@mui/joy";
import { Typography } from "@mui/material";
import { useState } from "react";

function IdentityPage(){
    const { state } = useAuthContext();

    useState(() => {
        console.log(state);
    }, [state]);

    return (<>
        <Box>
            <Typography variant="h2">Hii! {state.displayName}</Typography>
            <Chip color="primary" size="sm" variant="soft" sx={{ marginTop: "4px" }}>Email - {state.email}</Chip>
        </Box>
    </>);
}

export default IdentityPage;