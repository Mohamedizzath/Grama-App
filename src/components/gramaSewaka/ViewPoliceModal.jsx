import { Modal, ModalDialog, Box, Typography, Grid, FormControl, FormLabel, Input, Button, Select, Option, Chip } from "@mui/joy";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AlarmIcon from '@mui/icons-material/Alarm';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import { useAuthContext } from "@asgardeo/auth-react";
import React from "react";
import { useState, useEffect } from "react";

function ViewPoliceModal({ viewOpen, setViewOpen, details }){
    const [selectedStatus, setSelectedStatus] = useState((details["status"]));
    const { state, getAccessToken } = useAuthContext();
    let headerTheme = "primary";
    let chipIcon = null;
    let chipDisplay = "Pending";

    if(details["status"] === "Verified"){
        headerTheme = "success";
        chipIcon = <CheckIcon/>
        chipDisplay = "Verified";
    } else if(details["status"] === "Rejected"){
        headerTheme = "danger";
        chipIcon = <CloseIcon />
        chipDisplay = "Rejected"
    } else {
        headerTheme = "primary";
        chipIcon = <AlarmIcon />
        chipDisplay = "Pending";
    }

    const [latestIdentityRequest, setLatestIdentityRequest ] = useState([]);
    //fetching latest verified identity request, if it exists
    useEffect(() => {
        const fetchLatestIdentityRequest = async () => {
            try {
                const nic = details["nic"];
                // const nic = "200070903808"; //change this 
                const response = await fetch(`http://localhost:9090/identity/requests/latest/${nic}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${await getAccessToken()}`
                    }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setLatestIdentityRequest(data);
                } else {
                    const errorData = await response.json(); // Attempt to parse error message
                    console.error('Error fetching for latest identity check for PC:', errorData.message || response.statusText)
                }
            } catch (error) {
                console.error('Error during fetching request:', error);
            }
        }
    
        fetchLatestIdentityRequest();
    }, [details]);

    const [latestAddressRequest, setLatestAddressRequest ] = useState([]); 
    //fetching latest verified address request, if it exists
    useEffect(() => {
        const fetchLatestAddressRequest = async () => {
            try {
                const nic = details["nic"];
                console.log(nic);
                // const nic = "200070903808";
                const response = await fetch(`http://localhost:9090/address/requests/latest/${nic}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${await getAccessToken()}`
                    }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setLatestAddressRequest(data);
                } else {
                    const errorData = await response.json();
                    console.error('Error fetching for latest address check for PC:', errorData.message || response.statusText)
                }
            } catch (error) {
                console.error('Error during fetching request:', error);
            }
        }
    
        fetchLatestAddressRequest();
    }, [details]);

    return <>
        <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
                <ModalDialog sx={{ padding: "0px",overflowX: "hidden", overflowY: "auto" }}>
                    <Box sx={{ height: "15px",
                    background: (theme) =>
                    `linear-gradient(to top, ${theme.vars.palette[headerTheme][800]}, ${theme.vars.palette[headerTheme][500]})`,    
                    }}></Box>
                    <Box sx={{ padding: "16px"}}>
                        <Box display="flex" alignItems="center" justifyContent="flex-start">
                            <LocalPoliceIcon color="neutral" fontSize="sm" />
                            &nbsp;
                            <Typography level="body-md">Police Request Details</Typography>
                        </Box>
                        
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography level="h2">Applied date: {new Date(details["appliedTime"][0] * 1000).toLocaleDateString()}</Typography>
                            <Chip color={headerTheme} startDecorator={chipIcon} sx={{ paddingX: "16px", paddingY: "4px"}}>{chipDisplay}</Chip>
                        </Box>
                        
                        <Grid container spacing={2} sx={{ flexGrow: 1, marginTop: "16px" }}>
                            <Grid md={12}>
                                <FormControl>
                                    <FormLabel>Reason for applying</FormLabel>
                                    <Input value={details["reason"]}/> 
                                </FormControl>
                            </Grid>

                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>NIC Number</FormLabel>
                                    {/* <Input value={details["nic"]}/>  */}
                                    <Input value={"200070903808"}/> 
                                </FormControl>
                            </Grid>

                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Division</FormLabel>
                                    <Input value={details["division"]}/> 
                                </FormControl>
                            </Grid>

                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Identity Approved By</FormLabel>
                                    <Input 
                                        value={
                                            latestIdentityRequest && latestIdentityRequest['approved_by']
                                                ? latestIdentityRequest['approved_by']
                                                : "Unknown"
                                        }
                                    /> 
                                </FormControl>
                            </Grid>

                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Identity Approved Date</FormLabel>
                                    <Input
                                        value={
                                            latestIdentityRequest && latestIdentityRequest['approved_date']
                                                ? new Date(latestIdentityRequest['approved_date'][0] * 1000).toLocaleDateString()
                                                : "Unknown"
                                        }
                                    /> 
                                </FormControl>
                            </Grid>

                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Address Approved By</FormLabel>
                                    <Input
                                        value={
                                            latestAddressRequest && latestAddressRequest['approved_by']
                                                ? latestAddressRequest['approved_by']
                                                : "Unknown"
                                        }
                                    />
                                </FormControl>
                            </Grid>

                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Address Approved Date</FormLabel>                                   
                                    <Input 
                                        value={
                                            latestAddressRequest && latestAddressRequest['approved_date']
                                                ? new Date(latestAddressRequest['approved_date'][0] * 1000).toLocaleDateString()
                                                : "Unknown"
                                        }
                                    /> 
                                </FormControl>
                            </Grid>

                            {
                                details["status"] !== "PENDING" && (
                                    <Grid xs={12} md={12}>
                                        <Typography level="body-sm">Request status details</Typography>
                                        {
                                            details["status"] === "Verified" && (
                                                <Box display="flex" justifyContent="space-between" alignItems="center">  
                                                    <Box display="flex" flexDirection="column">
                                                        <Typography level="h4">Approved date - {new Date(details["appliedTime"][0] * 1000).toLocaleDateString()}</Typography>
                                                        </Box>
                                                </Box>
                                            )
                                        }
                                        {
                                            details["status"] === "Rejected" && (
                                                <Box display="flex" justifyContent="space-between" alignItems="center">  
                                                    <Box display="flex" flexDirection="column">
                                                        <Typography level="h4">Rejected date - {new Date(details["appliedTime"][0] * 1000).toLocaleDateString()}</Typography>
                                                    </Box>
                                                </Box>
                                            )
                                        }
                                    </Grid>
                                )
                            }
                            <Grid md={12} display="flex" justifyContent="center" sx={{ marginTop: "12px"}}>
                                <Button color={headerTheme} variant="solid" startDecorator={<CloseIcon/>} sx={{ marginLeft: "8px" }} onClick={() => setViewOpen(false)}>Close</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </ModalDialog>
            </Modal>
    </>;
}

export default ViewPoliceModal;