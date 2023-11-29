import { useAuthContext } from "@asgardeo/auth-react";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import Sidebar from "../../components/citizen/Sidebar";
import { Box, Divider, Typography } from "@mui/joy";
import IdentityPage from "../../components/citizen/IdentityPage";
import AddressPage from "../../components/citizen/AddressPage";
import PolicePage from "../../components/citizen/PolicePage";

function CitizenIndex(){
    const { state } = useAuthContext();
    // Keep track of current page
    const [ currentPage, setCurrentPage ] = useState("IDENTITY-REQ");

    useEffect(() => {
        console.log(state);
    }, [state]);

    return <>
            <Header secured={true} role="CITIZEN" />
            <Box display="flex" flexDirection="row">
                <Sidebar currentPage={currentPage} changePage={setCurrentPage} />
                <Divider orientation="vertical" color="main"/>
                <Box sx={{ paddingTop: "18px", paddingLeft: "16px", paddingRight: "16px", width: "80%"}}>
                    { 
                        currentPage === "IDENTITY-REQ" && <IdentityPage />
                    }
                    {
                        currentPage === "ADDRESS-REQ" && <AddressPage />
                    }
                    {
                        currentPage === "POLICE-REQ" && <PolicePage />
                    }
                </Box>
            </Box>
        </>;
}

export default CitizenIndex;