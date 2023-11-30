import { useAuthContext } from "@asgardeo/auth-react";
import { Box, Button, Chip, FormControl, FormLabel, Grid, Input, Modal, ModalDialog, Option, Select, Divider } from "@mui/joy";
import { Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import identityReqs from "../../test-data/identityRequest";
import IdentityCard from "./IdentityPage/IdentityCard";
import ViewIdentityModal from "./IdentityPage/ViewIdentityModal";

function IdentityPage(){
    const { state } = useAuthContext();

    /* Identity request create process
        Things needed - Full name(with initials)
                        Full name(without initials)
                        NIC, Gender(Dropdown)
                        Contact Number
                        Email, Address,
                        DOB, Grama division(Dropdown)
    */

    // Managing the state for the modal
    const [postModal, setPostModal] = useState(false);

    // Handle get identity requests
    const [idReqs, setIdReqs] = useState(identityReqs);
    const [viewReqs, setViewReq] = useState(identityReqs);

    // Managing view status of cards
    const [ viewStatus, setViewStatus ] = useState("ALL");

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

    // View individual request
    const [ showReq, setShowReq ] = useState(false);
    const [ showingDetail, setShowingDetail ] = useState(null);

    // Handle individual showing component
    function showDetailRequest(details){
        setShowingDetail(details);
        setShowReq(true);

        console.log(details);
    }

    return (<>
        <Box>
            {/* Identity request create modal */}
            <Modal open={postModal} onClose={() => setPostModal(false)}>
                <ModalDialog sx={{ padding: "0px", overflow: "hidden" }}>
                    <Box sx={{ height: "15px",
                    background: (theme) =>
                    `linear-gradient(to top, ${theme.vars.palette["main"][800]}, ${theme.vars.palette["main"][500]})`,    
                    }}></Box>
                    <Box sx={{ padding: "16px"}}>
                        <Typography level="h2">Create new Identity request!</Typography>
                        <Grid container spacing={2} sx={{ flexGrow: 1, marginTop: "16px" }}>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Full name(with initials)</FormLabel>
                                    <Input placeholder="P.M. Kamal Perera" /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Full name(without initials)</FormLabel>
                                    <Input placeholder="Pasan Madawa Kamal Perera" /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>NIC number</FormLabel>
                                    <Input placeholder="200107800876" /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Gender</FormLabel>
                                    <Select placeholder="Select Gender">
                                        <Option>Male</Option>
                                        <Option>Femal</Option>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Contact number</FormLabel>
                                    <Input placeholder="071-112 3232" /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input placeholder="email@example.com" /> 
                                </FormControl>
                            </Grid>
                            <Grid md={12}>
                                <FormControl>
                                    <FormLabel>Address</FormLabel>
                                    <Input placeholder="Your address" /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Date of birth</FormLabel>
                                    <Input type="date" /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Grama division</FormLabel>
                                    <Select placeholder="Select division">
                                        <Option>Kollupitiya</Option>
                                        <Option>Bambalapitiya</Option>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid md={12} display="flex" justifyContent="center" sx={{ marginTop: "12px"}}>
                                <Button color="main" variant="soft" startDecorator={<CloseIcon/>} onClick={() => setPostModal(false)}>Cancel</Button>
                                <Button color="main" variant="solid" startDecorator={<CheckIcon/>} sx={{ marginLeft: "8px" }}>Create</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </ModalDialog>
            </Modal>
            {/* Individual request showing modal */}
            {
                showReq && <ViewIdentityModal viewOpen={showReq} setViewOpen={setShowReq} details={showingDetail} />
            }
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography level="h2">Hii! {state.displayName}</Typography>
                <Button color="main" size="sm" variant="solid" startDecorator={<AddIcon />} onClick={() => setPostModal(true)}>New Request</Button> 
            </Box>
            <Chip color="primary" size="sm" variant="soft" sx={{ marginTop: "4px", marginBottom: "12px" }}>Email - {state.email}</Chip>
            {/* Recent Identity requests */}
            <Divider />
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ marginTop: "18px", marginBottom: "8px" }}>
                <Typography level="h2">Identity Requests</Typography>
                <Select size="sm" defaultValue={viewStatus} onChange={(event,value) => setViewStatus(value)} sx={{ width: "180px"}}>
                    <Option key="ALL" value="ALL">All requests</Option>
                    <Option key="PENDING" value="PENDING">Pending requests</Option>
                    <Option key="VERIFIED" value="VERIFIED">Confirmed requests</Option>
                    <Option key="REJECTED" value="REJECTED">Rejected requests</Option>
                </Select>
            </Box>
            <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{ 
                flexWrap: "wrap",
                }}>
                {
                    viewReqs.map((req, index) => <IdentityCard index={index} details={req} showDetails={showDetailRequest}/>)
                }
            </Box>
        </Box>
    </>);
}

export default IdentityPage;