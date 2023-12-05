import { Modal, ModalDialog, Box, Typography, Grid, FormControl, FormLabel, Input, Button, Select, Option, Chip } from "@mui/joy";
import CloseIcon from '@mui/icons-material/Close';
import { useAuthContext } from "@asgardeo/auth-react";
import CheckIcon from '@mui/icons-material/Check';
import AlarmIcon from '@mui/icons-material/Alarm';
import SaveIcon from '@mui/icons-material/Save'; 
import React, { useEffect } from "react";
import { useState } from "react";

function ViewIdentityModal({ viewOpen, setViewOpen, details }) {
    const [selectedStatus, setSelectedStatus] = useState((details["status"]));
    // console.log(sessionStorage.getItem('User-name'));

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

    const { state, getAccessToken } = useAuthContext();
    const request_id = details["id"];
    const grama_name = sessionStorage.getItem('User-name');
    const status = selectedStatus;

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:9090/identity/requests', {
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
    

    return (
        <>
            <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
                <ModalDialog sx={{ padding: "0px", overflowX: "hidden", overflowY: "auto" }}>
                    <Box sx={{ height: "15px", background: (theme) => `linear-gradient(to top, ${theme.vars.palette[headerTheme][800]}, ${theme.vars.palette[headerTheme][500]})`, }}></Box>
                    <Box sx={{ padding: "16px" }}>
                        <Typography level="body-md">Identity Request Details</Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography level="h2">Applied date: {new Date(details["applied_date"][0] * 1000).toLocaleDateString()}</Typography>
                            <Chip color={headerTheme} startDecorator={chipIcon} sx={{ paddingX: "16px", paddingY: "4px" }}>{chipDisplay}</Chip>
                        </Box>

                        <Grid container spacing={2} sx={{ flexGrow: 1, marginTop: "16px" }}>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Full name(with initials)</FormLabel>
                                    <Input value={details["initials_fullname"]}/> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Full name(without initials)</FormLabel>
                                    <Input value={details["fullname"]}/> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>NIC number</FormLabel>
                                    <Input value={details["NIC"]}/> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Gender</FormLabel>
                                    <Input value={details["gender"]}/> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Contact number</FormLabel>
                                    <Input value={details["contact_num"]}/> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input value={details["email"]}/> 
                                </FormControl>
                            </Grid>
                            <Grid md={12}>
                                <FormControl>
                                    <FormLabel>Address</FormLabel>
                                    <Input value={details["address"]}/>
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Date of birth</FormLabel>
                                    <Input value={new Date(details["DOB"][0] * 1000).toLocaleDateString()} /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Grama division</FormLabel>
                                    <Input value={details['division']} /> 
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
                            {/* to display approved by / rejected by details */}
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
        </>
    );
}

export default ViewIdentityModal;
