import { Modal, ModalDialog, Box, Typography, Grid, FormControl, FormLabel, Input, Button, Select, Option, Chip } from "@mui/joy";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AlarmIcon from '@mui/icons-material/Alarm';
import SaveIcon from '@mui/icons-material/Save'; 
import LocationOnIcon from '@mui/icons-material/LocationOn';
import React from "react";
import { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";

function ViewAddressModal({ viewOpen, setViewOpen, details }){
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

    const handleStatusChange = (event, newValue) => {
        setSelectedStatus(newValue);
    };

    // handle status change when saving modal
    const request_id = details["id"];
    const grama_name = sessionStorage.getItem('User-name');
    // console.log(grama_name);
    const status = selectedStatus;

    const handleSave = async () => {
        try {
            const response = await fetch(`${window.config.apiGatewayUrl}/address/requests`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getAccessToken()}`
                },
                body: JSON.stringify({
                    grama_name,
                    request_id,
                    status
                })
            });
    
            if (response.ok) {
                console.log("Status Changed:", selectedStatus);
                setViewOpen(false);
            } else {
                console.error('Error updating status:', response.statusText);
            }
        } catch (error) {
            console.error('Error during status update:', error);
        }
    };

    const [latestIdentityRequest, setLatestIdentityRequest ] = useState([]);

    //fetching latest verified identity request, if it exists
    useEffect(() => {
        const fetchLatestRequest = async () => {
            try {
                const nic = details["NIC"];
                const response = await fetch(`${window.config.apiGatewayUrl}/identity/requests/latest/${nic}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${await getAccessToken()}`
                    }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setLatestIdentityRequest(data);
                    //console.log(data);
                } else {
                    const errorData = await response.json(); // Attempt to parse error message
                    console.error('Error fetching for latest identity check for AC:', errorData.message || response.statusText)
                }
            } catch (error) {
                console.error('Error during fetching request:', error);
            }
        }
    
        fetchLatestRequest();
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
                            <LocationOnIcon color="neutral" fontSize="sm" />
                            &nbsp;
                            <Typography level="body-md">Address Request Details</Typography>
                        </Box>
                        
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography level="h2">Applied date: {new Date(details["applied_date"][0] * 1000).toLocaleDateString()}</Typography>
                            <Chip color={headerTheme} startDecorator={chipIcon} sx={{ paddingX: "16px", paddingY: "4px"}}>{chipDisplay}</Chip>
                        </Box>
                        
                        <Grid container spacing={2} sx={{ flexGrow: 1, marginTop: "16px" }}>
                            <Grid md={12}>
                                <FormControl>
                                    <FormLabel>Address</FormLabel>
                                    <Input value={details["address"]}/> 
                                </FormControl>
                            </Grid>

                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>NIC Number</FormLabel>
                                    <Input value={details["NIC"]}/> 
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

                            {/* allow status change only if status is pending */}
                            {
                                details["status"] === "Pending" && (
                                    <Grid xs={12} md={6}>
                                        <FormControl>
                                            <FormLabel>Status</FormLabel>
                                            <Select defaultValue={selectedStatus} onChange={handleStatusChange} sx={{ backgroundColor: 'lightgray' }}>
                                            <Option value="Pending" sx={{ color: 'gray', pointerEvents: 'none' }}>
                                                Pending
                                            </Option>
                                                <Option value="Verified" sx={{ color: 'green' }}>
                                                    Verify
                                                </Option>
                                                <Option value="Rejected" sx={{ color: 'red' }}>
                                                    Reject
                                                </Option>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )
                            }

                            {
                                details["status"] !== "Pending" && (
                                    <Grid xs={12} md={12}>
                                        <Typography level="body-sm">Request status details</Typography>
                                        {
                                            details["status"] === "Verified" && (
                                                <Box display="flex" justifyContent="space-between" alignItems="center">  
                                                    <Box display="flex" flexDirection="column">
                                                        <Typography level="h4">Approved by - {details["approved_by"]}</Typography>
                                                        <Typography level="body-sm">Approved date - {new Date(details["approved_date"][0] * 1000).toLocaleDateString()}</Typography> 
                                                        </Box>
                                                </Box>
                                            )
                                        }
                                        {
                                            details["status"] === "Rejected" && (
                                                <Box display="flex" justifyContent="space-between" alignItems="center">  
                                                    <Box display="flex" flexDirection="column">
                                                        <Typography level="h4">Rejected by - {details["approved_by"]}</Typography>
                                                        <Typography level="body-sm">Rejected date - {new Date(details["approved_date"][0] * 1000).toLocaleDateString()}</Typography> 
                                                    </Box>
                                                </Box>
                                            )
                                        }
                                    </Grid>
                                )
                            }
                            <Grid md={12} display="flex" justifyContent="center" sx={{ marginTop: "12px"}}>
                                {
                                    details["status"] === "Pending" && (
                                        <>
                                            <Button color={headerTheme} variant="solid" startDecorator={<SaveIcon />} sx={{ marginLeft: "8px" }} onClick={handleSave}>Save</Button>
                                        </>
                                    )
                                }

                                <Button color={headerTheme} variant="solid" startDecorator={<CloseIcon/>} sx={{ marginLeft: "8px" }} onClick={() => setViewOpen(false)}>Close</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </ModalDialog>
            </Modal>
    </>;
}

export default ViewAddressModal;