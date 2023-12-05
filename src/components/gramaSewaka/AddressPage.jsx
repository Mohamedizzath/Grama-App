import React from "react";
import SubHeader from "./subHeader";
import { useAuthContext } from "@asgardeo/auth-react";
import { Box, Typography, Table, Select, Option, Sheet, Button  } from "@mui/joy";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useState, useEffect } from "react";
import ViewAddressModal from "./ViewAddressModal";

function AddressPage(){

    const rowsPerPage = 4;
    const { state, getAccessToken } = useAuthContext();
    const [noRequests, setNoRequests] = useState(false); //for no tables in rows
    const [idReqs, setIdReqs] = useState([]);
    const [viewReqs, setViewReq] = useState([]);
    const [viewStatus, setViewStatus] = useState("ALL");
    const [showingDetail, setShowingDetail] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showReq, setShowReq] = useState(false);

    //for the requests based on gs division id 
    useEffect(() => {
        const fetchIdentityRequests = async () => {
            try {
                const gdid = sessionStorage.getItem('User-DID');
                const rlimit = 10000;

                let url = `http://localhost:9090/address/requests?gdid=${gdid}&rlimit=${rlimit}`;

                const response = await fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${await getAccessToken()}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setIdReqs(data);
                } else {
                    console.error('Error fetching identity requests:', response.statusText);
                }
            } catch (error) {
                console.error('Error during fetchIdentityRequests:', error);
            }
        };

        fetchIdentityRequests();
    }, [viewStatus]);

    //filter based on status types
    useEffect(() => {
        const filterRequests = () => {
            if (viewStatus === "PENDING") {
                return idReqs.filter((req) => req["status"] === "Pending");
            } else if (viewStatus === "VERIFIED") {
                return idReqs.filter((req) => req["status"] === "Verified");
            } else if (viewStatus === "REJECTED") {
                return idReqs.filter((req) => req["status"] === "Rejected");
            } else {
                return idReqs;
            }
        };

        const filteredReqs = filterRequests();
        const totalItems = filteredReqs.length;
        const calculatedTotalPages = Math.ceil(totalItems / rowsPerPage);

        if(calculatedTotalPages > 0){
            setTotalPages(calculatedTotalPages);
            setNoRequests(false);
        }else if(calculatedTotalPages == 0){
            setTotalPages(1);
            setNoRequests(true);
        }

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const slicedReqs = filteredReqs.slice(startIndex, endIndex);

        setViewReq(slicedReqs);
    }, [viewStatus, idReqs, currentPage]);
    

    //get all divisions
    const [arrayOfDivisions, setArrayOfDivisions] = useState([]);
    useEffect(() => {
        async function fetchRequest() {
            try {
                const response = await fetch("http://localhost:9090/gramadivisions", {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${await getAccessToken()}`
                    }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setArrayOfDivisions(data);
                } else {
                    console.error('Error fetching divisions:', response.statusText);
                }
            } catch (error) {
                console.error('Error during divisions:', error);
            }
        }
    
        fetchRequest();
    }, [arrayOfDivisions]); 
    
    // find matching division using id & pass to modal
    function showDetailRequest(details) {
        const matchDivision = arrayOfDivisions.find(request => request.id === details['gramadivisionId']);
        if (matchDivision) {
            const newDivision = matchDivision.GN_division + "(" + matchDivision.DS_division + ")";
            console.log(newDivision);

            setShowingDetail({
                ...details,
                division: newDivision, 
            });
            setShowReq(true);
        } else {
            setShowingDetail({
                ...details,
                division: "Unknown", 
            });
            setShowReq(true);
        }
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
                <Typography level="h2">Address Requests</Typography>
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
                            <th><Typography level="h5" sx={{color:'#F26202'}}>NIC</Typography></th>
                            <th><Typography level="h5" sx={{color:'#F26202'}}>Address</Typography></th>
                            <th style={{textAlign:'center'}}><Typography level="h5" sx={{color:'#F26202'}}>Action</Typography></th>
                        </tr>
                    </thead>
                    <tbody style={{ overflowY: 'auto', maxHeight: '300px' }}>
                    {noRequests ? (
                            <tr>
                                <td colSpan="4" style={{textAlign:'center'}}>
                                    <Typography level="body-sm">No requests available.</Typography>
                                </td>
                            </tr>
                        ) : (
                            viewReqs.map((req, index) => (
                                <tr key={index}>
                                    <td><Typography level="body-sm">{new Date(req["applied_date"][0] * 1000).toLocaleDateString()}</Typography></td>
                                    <td><Typography level="body-sm">{req.NIC}</Typography></td>
                                    <td><Typography level="body-sm">{req.address}</Typography></td>
                                    <td style={{textAlign:'center'}}>
                                        <Button color="main" variant="outlined" sx={{ maxHeight: '3px', paddingX: '10px', fontSize:'10px' }} onClick={() => showDetailRequest(req)}>View Details</Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
                {/* Individual request showing modal */}
                {
                    showReq && <ViewAddressModal viewOpen={showReq} setViewOpen={setShowReq} details={showingDetail} />
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

export default AddressPage;