import React from "react";
import SubHeader from "./subHeader";
import { Box, Typography, Table, Select, Option, Sheet, Button  } from "@mui/joy";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import policeRequests from "../../test-data/policeRequests";
import { useState, useEffect } from "react";
import ViewPoliceModal from "./ViewPoliceModal";

function PolicePage(){

    const rowsPerPage = 4;

    const [idReqs, setIdReqs] = useState(policeRequests);
    const [viewReqs, setViewReq] = useState([]);
    const [viewStatus, setViewStatus] = useState("ALL");
    const [showingDetail, setShowingDetail] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showReq, setShowReq] = useState(false);

    useEffect(() => {
        const filterRequests = () => {
            if (viewStatus === "PENDING") {
                return idReqs.filter((req) => req["status"] === "PENDING");
            } else if (viewStatus === "VERIFIED") {
                return idReqs.filter((req) => req["status"] === "VERIFIED");
            } else if (viewStatus === "REJECTED") {
                return idReqs.filter((req) => req["status"] === "REJECTED");
            } else {
                return idReqs;
            }
        };

        const filteredReqs = filterRequests();
        const totalItems = filteredReqs.length; 
        const calculatedTotalPages = Math.ceil(totalItems / rowsPerPage); 

        setTotalPages(calculatedTotalPages); 

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const slicedReqs = filteredReqs.slice(startIndex, endIndex);

        setViewReq(slicedReqs);
    }, [viewStatus, idReqs, currentPage]);
    

    // view details function
    function showDetailRequest(details) {
        setShowingDetail(details);
        setShowReq(true);
    }

    function handlePageChange(event, value) {
        if (value > 0 && value <= totalPages) {
            setCurrentPage(value);
        }
    }


    return(
        <Box>
            <SubHeader />
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ marginTop: "18px", marginBottom: "8px" }}>
                <Typography level="h2">Police Requests</Typography>
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
                            <th style={{ textAlign: 'center' }}><Typography level="h5" sx={{color:'#F26202'}}>Applied Date</Typography></th>
                            <th style={{ textAlign: 'center' }}><Typography level="h5" sx={{color:'#F26202'}}>NIC</Typography></th>
                            <th style={{ textAlign: 'center' }}><Typography level="h5" sx={{color:'#F26202'}}>Action</Typography></th>
                        </tr>
                    </thead>
                    <tbody style={{ overflowY: 'auto', maxHeight: '300px' }}>
                        {viewReqs.map((req, index) => (
                            <tr key={index} style={{ textAlign: 'center' }}>
                                <td><Typography level="body-sm">{req["applied-date"]}</Typography></td>
                                <td><Typography level="body-sm">{req.nic}</Typography></td>
                                <td>
                                    <Button color="main" variant="outlined" sx={{ maxHeight: '3px', paddingX: '10px', fontSize:'10px' }} onClick={() => showDetailRequest(req)}>View Details</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {/* Individual request showing modal */}
                {
                    showReq && <ViewPoliceModal viewOpen={showReq} setViewOpen={setShowReq} details={showingDetail} />
                }
            </Sheet>  
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
                <Button variant="outlined" size="small" color="main"
                    disabled={currentPage === 1}
                    onClick={(e) => handlePageChange(e, currentPage - 1)}
                    sx={{ marginRight: '8px' }}
                >
                    <KeyboardArrowLeftIcon fontSize="small" />
                </Button>
                <Typography level="body-xs">Page {currentPage} of {totalPages}</Typography>
                <Button variant="outlined" size="small" color="main"
                    disabled={currentPage >= totalPages}
                    onClick={(e) => handlePageChange(e, currentPage + 1)}
                    sx={{ marginLeft: '8px' }}
                >
                    <KeyboardArrowRightIcon fontSize="small" />
                </Button>
            </div>
        </Box>
    );
}

export default PolicePage;