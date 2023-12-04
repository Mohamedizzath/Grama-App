import { Modal, ModalDialog, Box, Typography, Grid, FormControl, FormLabel, Input, Button, Select, Option, Chip } from "@mui/joy";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AlarmIcon from '@mui/icons-material/Alarm';
import SaveIcon from '@mui/icons-material/Save'; 
import LocationOnIcon from '@mui/icons-material/LocationOn';
import React from "react";
import { useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";

function ViewAddressModal({ viewOpen, setViewOpen, details }){
    const [selectedStatus, setSelectedStatus] = useState((details["status"]));

    let headerTheme = "primary";
    let chipIcon = null;
    let chipDisplay = "Pending";

    if(details["status"] === "VERIFIED"){
        headerTheme = "success";
        chipIcon = <CheckIcon/>
        chipDisplay = "Verified";
    } else if(details["status"] === "REJECTED"){
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
    const handleSave = () => {
        console.log("Status Changed:", selectedStatus);
        setViewOpen(false);
    };

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
                                    <Input value={details["identity-check-approved-by"]} />
                                </FormControl>
                            </Grid>

                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Identity Approved Date</FormLabel>
                                    <Input value={details["identity-check-approved-date"]} />
                                </FormControl>
                            </Grid>

                            {/* allow status change only if status is pending */}
                            {
                                details["status"] === "PENDING" && (
                                    <Grid xs={12} md={6}>
                                        <FormControl>
                                            <FormLabel>Status</FormLabel>
                                            <Select defaultValue={selectedStatus} onChange={handleStatusChange} sx={{ backgroundColor: 'lightgray' }}>
                                            <Option value="PENDING" sx={{ color: 'gray', pointerEvents: 'none' }}>
                                                Pending
                                            </Option>
                                                <Option value="VERIFIED" sx={{ color: 'green' }}>
                                                    Verify
                                                </Option>
                                                <Option value="REJECTED" sx={{ color: 'red' }}>
                                                    Reject
                                                </Option>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )
                            }

                            {
                                details["status"] !== "PENDING" && (
                                    <Grid xs={12} md={12}>
                                        <Typography level="body-sm">Request status details</Typography>
                                        {
                                            details["status"] === "VERIFIED" && (
                                                <Box display="flex" justifyContent="space-between" alignItems="center">  
                                                    <Box display="flex" flexDirection="column">
                                                        <Typography level="h4">Approved by - {details["approved-by"]["name"]}</Typography>
                                                        <Typography level="body-sm">Approved date - {details["approved-by"]["approved-date"]}</Typography> 
                                                        </Box>
                                                </Box>
                                            )
                                        }
                                        {
                                            details["status"] === "REJECTED" && (
                                                <Box display="flex" justifyContent="space-between" alignItems="center">  
                                                    <Box display="flex" flexDirection="column">
                                                        <Typography level="h4">Rejected by - {details["approved-by"]["name"]}</Typography>
                                                        <Typography level="body-sm">Rejected date - {details["approved-by"]["approved-date"]}</Typography> 
                                                    </Box>
                                                </Box>
                                            )
                                        }
                                    </Grid>
                                )
                            }
                            <Grid md={12} display="flex" justifyContent="center" sx={{ marginTop: "12px"}}>
                                {
                                    details["status"] === "PENDING" && (
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