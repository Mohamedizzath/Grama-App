import Header from "../../components/Header";
import {useState } from "react";
import { Box, Divider } from "@mui/joy";
import Sidebar from "../../components/gramaSewaka/Sidebar";
import IdentityPage from "../../components/gramaSewaka/IdentityPage";
import AddressPage from "../../components/gramaSewaka/AddressPage";
import PolicePage from "../../components/gramaSewaka/PolicePage";

function GramaSewakaIndex(){
    const [ currentPage, setCurrentPage ] = useState("IDENTITY-REQ");

    return <>
        <Header secured={true} role="GRAMA-SEWAKA" />
        <Box display="flex" flexDirection="row">
            <Sidebar currentPage={currentPage} changePage={setCurrentPage} />
            <Divider orientation="vertical" />
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

export default GramaSewakaIndex;