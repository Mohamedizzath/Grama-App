import React from "react";
import SubHeader from "./subHeader";
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, Select, Option } from "@mui/joy";
import identityReqs from "../../test-data/identityRequest";
import { useState, useEffect } from "react";

function IdentityPage(){

    // Handle get identity requests
    const [idReqs, setIdReqs] = useState(identityReqs);
    const [viewReqs, setViewReq] = useState(identityReqs);

    // Managing view status of cards
    const [ viewStatus, setViewStatus ] = useState("ALL");

    const [showingDetail, setShowingDetail] = useState(null);

    // Managing req cards
    useEffect(() => {
        let tempReq = [];
        if(viewStatus === "PENDING"){
            tempReq = idReqs.filter(req => req["status"] === "PENDING");
        } else if(viewStatus === "VERIFIED"){
            tempReq = idReqs.filter(req => req["status"] === "VERIFIED");
        } else if(viewStatus === "REJECTED"){
            tempReq = idReqs.filter(req => req["status"] === "REJECTED");
        } else {
            tempReq = idReqs;
        }

        setViewReq(tempReq);
        console.log(tempReq);
    }, [viewStatus]);

    // view details function
    function showDetailRequest(details) {
        setShowingDetail(details);
        setShowReq(true);
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
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>NIC</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Contact Number</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {viewReqs.map((req, index) => (
                    <TableRow key={index}>
                    <TableCell>{req["full-name"]}</TableCell>
                    <TableCell>{req.nic}</TableCell>
                    <TableCell>{req.address}</TableCell>
                    <TableCell>{req["contact-num"]}</TableCell>
                    <TableCell>
                        <button onClick={() => showDetailRequest(req)}>View Details</button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>     
        </Box>
    );
}

export default IdentityPage;