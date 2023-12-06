import { useAuthContext } from "@asgardeo/auth-react";
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Box, Button, Chip, FormControl, FormLabel, Grid, Input, Modal, ModalClose, ModalDialog, Option, Select, Skeleton, Typography } from "@mui/joy";
import { useState } from "react";
import { useEffect } from "react";
import KeyIcon from '@mui/icons-material/Key';
import { useNavigate } from "react-router";
import CheckIcon from '@mui/icons-material/Check';

function Profile({ open, setOpen, setErrorObj, setShowError }){
    // Fetching user details
    const { state, getAccessToken } = useAuthContext();
    const [isLoading, setIsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);
    const [showingDetails, setShowingDetails] = useState(null);

    const navigate = useNavigate();

    const [statusObj, setStatusObj] = useState(defStatusObj);
    const [isValidUpdate, setIsValidUpdate] = useState(false); 

    async function initialLoad(){
        try {
            const response = await fetch('https://api.asgardeo.io/t/interns/oauth2/userinfo', {
                headers: {
                    Authorization: `Bearer ${await getAccessToken()}`
                }
            });
            
            if (response.ok) {
                const json = await response.json();
                setUserDetails(json);
                setShowingDetails(json);

                setIsLoading(false);
            } else if(response.status === 401) {
                const errObj = {
                    title: "Oops, Unauthorized!",
                    body: "Looks like your session expired. Please sign out and sign in again.",
                    mainBtn: { mainBtnText: "Sign out", mainBtnAction: () => signOut() },
                    secondBtn: { secondBtnText: "Go to Home", secondBtnAction: () => navigate("/") }
                }

                setErrorObj(errObj);
                setShowError(true);
            } else {
                const errObj = {
                    title: "Oops, Internal server error!",
                    body: "Looks like internal server having some issue. Please try again later.",
                    mainBtn: { mainBtnText: "Go to Home", mainBtnAction: () => navigate("/") },
                    secondBtn: { secondBtnText: "Cancel", secondBtnAction: () => showError(false) }
                } 

                setErrorObj(errObj);
                setShowError(true);
            }
        } catch (error) {
            const errObj = {
                title: "Oops, Internal server error!",
                body: "Looks like internal server having some issue. Please try again later.",
                mainBtn: { mainBtnText: "Go to Home", mainBtnAction: () => navigate("/") },
                secondBtn: { secondBtnText: "Cancel", secondBtnAction: () => showError(false) }
            }

            setErrorObj(errObj);
            setShowError(true);
        }
    }

    // Debugging user details
    useEffect(() => {
        // Validate the showing details with initial details
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if(!showingDetails){
            setIsValidUpdate(false);
        } else {
            // Check the validity of the showingDetails
            let tempStatusObj = statusObj;
            let validUpdate = false;

            if(showingDetails["name"].length < 1){
                tempStatusObj = {...tempStatusObj, name: { color: "danger", valid: false }};
            } else if(showingDetails["name"] !== userDetails["name"]){
                validUpdate = true;
                tempStatusObj = {...tempStatusObj, name: { color: "success", valid: true }};
            } else {
                tempStatusObj = {...tempStatusObj, name: { color: "neutral", valid: true }};
            }
                
            if(!emailRegex.test(showingDetails["email"])){
                tempStatusObj = {...tempStatusObj, email: { color: "danger", valid: false }};
            } else if(showingDetails["email"] !== userDetails["email"]) {
                validUpdate = true;
                tempStatusObj = {...tempStatusObj, email: { color: "success", valid: true }};
            } else {
                tempStatusObj = {...tempStatusObj, email: { color: "neutral", valid: true }};
            }

            if(showingDetails["birthdate"] !== userDetails["birthdate"]){
                validUpdate = true;
                tempStatusObj = {...tempStatusObj, birthdate: { color: "success", valid: true }};
            } else {
                tempStatusObj = {...tempStatusObj, birthdate: { color: "neutral", valid: true }};
            }

            if(showingDetails["gender"] !== userDetails["gender"]){
                validUpdate = true;
                tempStatusObj = {...tempStatusObj, gender: { color: "success", valid: true }};
            } else {
                tempStatusObj = {...tempStatusObj, gender: { color: "neutral", valid: true }};
            }

            setStatusObj(tempStatusObj);
            setIsValidUpdate(validUpdate);

            console.log(tempStatusObj);
            console.log(validUpdate);
        }
    }, [showingDetails]);

    // Initial load of profile details
    useEffect(() => {
        if(open){
            initialLoad();
        }
    }, [open]);

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
                            <Typography level="h2">Display name - {state.displayName}</Typography>
                            <Chip color="main" sx={{ paddingX: "16px", paddingY: "4px"}}>User Role</Chip>
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
                                    <Typography level="body-sm" sx={{ marginY: "0px", paddingY: "0px"}}>Date of birth - {userDetails["birthdate"]}</Typography>
                                </Grid>
                                </>
                            )}  
                        </Grid>
                        <AccordionGroup transition={{ initial: "0.3s ease-out", expanded: "0.2s ease",}}>
                            <Accordion sx={{ marginTop: "16px" }}>
                                <AccordionSummary>
                                    <Typography level="h4">Quick Actions</Typography> 
                                </AccordionSummary>
                                <AccordionDetails sx={{ paddingX: "4px"}}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginY: "4px"}}>
                                        <Typography level="body-md" fontWeight="medium">Change current password</Typography>
                                        <Button color="primary" variant="soft" size="sm" startDecorator={<KeyIcon/>}>Change password</Button>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ marginTop: "16px" }}>
                                <AccordionSummary>
                                    <Typography level="h4">Update profile details</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                <Grid container spacing={2} sx={{ flexGrow: 1, marginTop: "8px" }}>
                                    <Grid xs={12} md={6}>
                                        <FormControl>
                                            <FormLabel>Name</FormLabel>
                                            {
                                                isLoading && <Skeleton sx={{ height: "25px", width: "100%" }} />
                                            }
                                            {
                                                !isLoading && <Input value={showingDetails["name"]} color={statusObj.name.color} onChange={(e) => setShowingDetails({...showingDetails, name: e.target.value})}/>
                                            } 
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <FormControl>
                                            <FormLabel>Email</FormLabel>
                                            {
                                                isLoading && <Skeleton sx={{ height: "25px", width: "100%" }} />
                                            }
                                            { 
                                                !isLoading && <Input value={showingDetails["email"]} color={statusObj.email.color} onChange={(e) => setShowingDetails({...showingDetails, email: e.target.value})}/> 
                                            }
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <FormControl>
                                            <FormLabel>Date of Birth</FormLabel>
                                            {
                                                isLoading && <Skeleton sx={{ height: "25px", width: "100%" }} />
                                            }
                                            { 
                                                !isLoading && <Input type="date" value={showingDetails["birthdate"]} color={statusObj.birthdate.color} onChange={(e) => setShowingDetails({...showingDetails, birthdate: e.target.value})}/> 
                                            }
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <FormControl>
                                            <FormLabel>Gender</FormLabel>
                                            {
                                                isLoading && <Skeleton sx={{ height: "25px", width: "100%" }} />
                                            }
                                            { 
                                                !isLoading && (
                                                    <Select placeholder="Select division" value={showingDetails["gender"]} color={statusObj.gender.color} onChange={(e, value) => setShowingDetails({...showingDetails, gender: value})}>
                                                    <Option key="MALE" value="Male">Male</Option>
                                                    <Option key="FEMALE" value="Female">Female</Option>
                                                    </Select>
                                                )
                                            }
                                        </FormControl>
                                    </Grid>
                                    <Box display="flex" justifyContent="center" sx={{ width: "100%", marginTop: "8px" }}>
                                        <Button color="success" variant="solid" disabled={!isValidUpdate} startDecorator={<CheckIcon/>}>Update details</Button>
                                    </Box>
                                </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionGroup>
                    </Box>
                </ModalDialog>
            </Modal>
        </>
    )
}

const defStatusObj ={
    name: {
        color: "neutral",
        valid: true,
    },
    email: {
        color: "neutral",
        valid: true,
    },
    birthdate: {
        color: "neutral",
        valid: true,
    },
    gender: {
        color: "neutral",
        valid: true,
    },
}

export default Profile;