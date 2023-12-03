import { Modal, ModalDialog, Box, Typography, Grid, FormControl, FormLabel, Input, Button, Select, Option, Chip } from "@mui/joy";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AlarmIcon from '@mui/icons-material/Alarm';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SaveIcon from '@mui/icons-material/Save'; 
import React from "react";

function ViewIdentityModal({ viewOpen, setViewOpen, details }) {
    const [selectedStatus, setSelectedStatus] = React.useState(details["status"]);

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

    const handleStatusChange = (event) => {
        if (event && event.target) {
            setSelectedStatus(event.target.value);
        }
    };

    const handleSave = () => {
        console.log("Status Changed:", selectedStatus);
        setViewOpen(false);
    };

    return (
        <>
            <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
                <ModalDialog sx={{ padding: "0px", overflowX: "hidden", overflowY: "auto" }}>
                    <Box sx={{ height: "15px", background: (theme) => `linear-gradient(to top, ${theme.vars.palette[headerTheme][800]}, ${theme.vars.palette[headerTheme][500]})`, }}></Box>
                    <Box sx={{ padding: "16px" }}>
                        <Typography level="body-md">Identity Request Details</Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography level="h2">Applied date: {details["applied-date"]}</Typography>
                            <Chip color={headerTheme} startDecorator={chipIcon} sx={{ paddingX: "16px", paddingY: "4px" }}>{chipDisplay}</Chip>
                        </Box>

                        <Grid container spacing={2} sx={{ flexGrow: 1, marginTop: "16px" }}>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Full name(with initials)</FormLabel>
                                    <Input value={details["full-name-initials"]}/> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Full name(without initials)</FormLabel>
                                    <Input value={details["full-name"]}/> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>NIC number</FormLabel>
                                    <Input value={details["nic"]}/> 
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
                                    <Input value={details["contact-num"]}/> 
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
                                    <Input type="date" value={details["dob"]} /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Grama division</FormLabel>
                                    <Input value={details["grama-division"]} /> 
                                </FormControl>
                            </Grid>
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
                                                    <Button color="neutral" variant="outlined" endDecorator={<ArrowForwardIcon />}>Contact via Slack</Button>
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
                                                    <Button color="neutral" variant="outlined" endDecorator={<ArrowForwardIcon />}>Contact via Slack</Button>
                                                </Box>
                                            )
                                        }
                                    </Grid>
                                )
                            }
                            <Grid md={12} display="flex" justifyContent="center" sx={{ marginTop: "12px"}}>
                                {
                                    details["status"] === "PENDING" ? (
                                        <>
                                            <FormControl>
                                                <FormLabel>Status</FormLabel>
                                                <Select value={selectedStatus} onChange={handleStatusChange}>
                                                    <Option value="VERIFIED">Verified</Option>
                                                    <Option value="REJECTED">Rejected</Option>
                                                </Select>
                                            </FormControl>

                                            <Button color={headerTheme} variant="solid" startDecorator={<SaveIcon />} sx={{ marginLeft: "8px" }} onClick={handleSave}>Save</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button color={headerTheme} variant="soft" startDecorator={<DeleteIcon/>}>Delete Request</Button>
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
