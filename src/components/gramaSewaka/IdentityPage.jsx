import React from "react";
import SubHeader from "./subHeader";
import { Box, Typography } from "@mui/joy";
//import { useState } from "react";

function IdentityPage(){

    //const [filterRequest, setFilterRequest] = useState();
    return(
        <Box>
            <SubHeader />
            <Box>
                <Typography level="h2" color="black">Identity Check</Typography> 

            </Box>       
        </Box>
    );
}

export default IdentityPage;