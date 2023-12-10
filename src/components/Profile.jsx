import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Box, Button, Chip, FormControl, FormLabel, Grid, Input, Modal, ModalClose, ModalDialog, Option, Select, Skeleton, Typography } from "@mui/joy";
import { useState } from "react";
import { useEffect } from "react";
import KeyIcon from '@mui/icons-material/Key';

function Profile({ open, setOpen, userDetails }){
    // Fetching user details
    const [isLoading, setIsLoading] = useState(true);
    const [showingDetails, setShowingDetails] = useState(userDetails);

    // Debugging the user details
    useEffect(() => {
        if(userDetails){
            setIsLoading(false);
        };
    }, [userDetails]);

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog sx={{ padding: "0px",overflowX: "hidden", overflowY: "auto" }}>
                    <Box sx={{ height: "15px",
                    background: (theme) =>
                    `linear-gradient(to top, ${theme.vars.palette["main"][800]}, ${theme.vars.palette["main"][500]})`,    
                    }}></Box>
                    <ModalClose variant="plain" sx={{ marginTop: "8px" }}/>
                    <Box sx={{ padding: "16px"}}>
                        <Typography level="body-md">Profile details</Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography level="h2">Display name - {userDetails["preferred_username"]}</Typography>
                            <Chip color="main" sx={{ paddingX: "16px", paddingY: "4px"}}>{sessionStorage.getItem('User-Role')}</Chip>
                        </Box>
                        <Grid container spacing={2} sx={{ flexGrow: 1, marginTop: "2px", paddingX: "4px" }}>
                            { !isLoading && (
                                <>
                                <Grid xs={12} md={6}>
                                    <Typography level="body-sm" sx={{ marginY: "0px", paddingY: "0px"}}>Email - {userDetails["email"]}</Typography>
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <Typography level="body-sm" sx={{ marginY: "0px", paddingY: "0px"}}>NIC - {userDetails["nic"]}</Typography>
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <Typography level="body-sm" sx={{ marginY: "0px", paddingY: "0px"}}>Contact number - {userDetails["phone_number"]}</Typography>
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <Typography level="body-sm" sx={{ marginY: "0px", paddingY: "0px"}}>Date of birth - {userDetails["Birth_Date"]}</Typography>
                                </Grid>
                                </>
                            )}  
                        </Grid>
                    </Box>
                </ModalDialog>
            </Modal>
        </>
    )
}

export default Profile;