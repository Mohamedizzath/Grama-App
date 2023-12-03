import React from "react";
import SubHeader from "./subHeader";
import { Box, Typography, Table, Select, Option, Sheet, Button  } from "@mui/joy";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import identityReqs from "../../test-data/identityRequest";
import { useState, useEffect } from "react";

function IdentityPage(){

    const rowsPerPage = 4;

    const [idReqs, setIdReqs] = useState(identityReqs);
    const [viewReqs, setViewReq] = useState([]); // 3
    const [viewStatus, setViewStatus] = useState("ALL");
    const [showingDetail, setShowingDetail] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        let tempReq = [];
        if (viewStatus === "PENDING") {
            tempReq = idReqs.filter((req) => req["status"] === "PENDING");
        } else if (viewStatus === "VERIFIED") {
            tempReq = idReqs.filter((req) => req["status"] === "VERIFIED");
        } else if (viewStatus === "REJECTED") {
            tempReq = idReqs.filter((req) => req["status"] === "REJECTED");
        } else {
            tempReq = idReqs;
        }
    
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const slicedReqs = tempReq.slice(startIndex, endIndex);
        console.log("total request", idReqs); //6
    
        setViewReq(slicedReqs); 
    }, [viewStatus, idReqs, currentPage]);
    

    // view details function
    function showDetailRequest(details) {
        setShowingDetail(details);
        setShowReq(true);
    }

    function handlePageChange(event, value) {
        const totalPages = Math.ceil(idReqs.length / rowsPerPage); 

        if (value > 0 && value <= totalPages) {
            setCurrentPage(value);
        }
    }


    return(
        <Box>
            <SubHeader />
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ marginTop: "18px", marginBottom: "8px" }}>
                <Typography level="h2">Identity Requests</Typography>
                <Select size="sm" defaultValue={viewStatus} onChange={(event,value) => setViewStatus(value)} sx={{ width: "180px"}}>
                    <Option key="ALL" value="ALL">All requests</Option>
                    <Option key="PENDING" value="PENDING">Pending requests</Option>
                    <Option key="VERIFIED" value="VERIFIED">Confirmed requests</Option>
                    <Option key="REJECTED" value="REJECTED">Rejected requests</Option>
                </Select>
            </Box>
            <Sheet
                sx={{
                    '--TableCell-height': '40px',
                    '--TableHeader-height': 'calc(1 * var(--TableCell-height))',
                    height: 300,
                    overflow: 'auto',
                    backgroundSize: '100% 40px, 100% 40px, 100% 14px, 100% 14px',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'local, local, scroll, scroll',
                    backgroundPosition: '0 var(--TableHeader-height), 0 100%, 0 var(--TableHeader-height), 0 100%',
                    backgroundColor: '#FFFFFF',           
                }}
            >
                <Table stickyHeader>
                    <thead>
                        <tr>
                            <th><Typography level="h5" sx={{color:'#F26202'}}>Applied Date</Typography></th>
                            <th><Typography level="h5" sx={{color:'#F26202'}}>Full Name</Typography></th>
                            <th><Typography level="h5" sx={{color:'#F26202'}}>NIC</Typography></th>
                            <th><Typography level="h5" sx={{color:'#F26202'}}>Address</Typography></th>
                            <th><Typography level="h5" sx={{color:'#F26202'}}>Contact Number</Typography></th>
                            <th><Typography level="h5" sx={{color:'#F26202'}}>Action</Typography></th>
                        </tr>
                    </thead>
                    <tbody style={{ overflowY: 'auto', maxHeight: '300px' }}>
                        {viewReqs.map((req, index) => (
                            <tr key={index}>
                                <td><Typography level="body-sm">{req["applied-date"]}</Typography></td>
                                <td><Typography level="body-sm">{req["full-name"]}</Typography></td>
                                <td><Typography level="body-sm">{req.nic}</Typography></td>
                                <td><Typography level="body-sm">{req.address}</Typography></td>
                                <td><Typography level="body-sm">{req["contact-num"]}</Typography></td>
                                <td>
                                    <Button color="main" variant="outlined" sx={{ maxHeight: '3px', paddingX: '10px', fontSize:'10px' }} onClick={() => showDetailRequest(req)}>View Details</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>  
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
                <Button variant="outlined" size="small" color="main"
                    disabled={currentPage === 1}
                    onClick={(e) => handlePageChange(e, currentPage - 1)}
                    sx={{ marginRight: '8px' }}
                >
                    <KeyboardArrowLeftIcon fontSize="small" />
                </Button>
                <Typography level="body-xs">Page {currentPage}</Typography>
                <Button variant="outlined" size="small" color="main"
                    disabled={currentPage * rowsPerPage >= idReqs.length}
                    onClick={(e) => handlePageChange(e, currentPage + 1)}
                    sx={{ marginLeft: '8px' }}
                >
                    <KeyboardArrowRightIcon fontSize="small" />
                </Button>
            </div>
        </Box>
    );
}

export default IdentityPage;