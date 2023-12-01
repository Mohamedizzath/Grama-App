import { Box, Button, Chip, Divider, Typography, Select, Option, Modal, ModalDialog, Grid, FormControl, FormLabel, Input } from "@mui/joy";
import { useAuthContext } from "@asgardeo/auth-react";
import AddIcon from '@mui/icons-material/Add';
import policeRequests from "../../test-data/policeRequests";
import { useState, useEffect } from "react";
import PoliceCard from "./PolicePage/PoliceCard";
import ViewPoliceModal from "./PolicePage/ViewPoliceModal";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

function PolicePage(){
    const { state } = useAuthContext();

    // Handle get identity requests
    const [idReqs, setIdReqs] = useState(policeRequests);
    const [viewReqs, setViewReq] = useState(policeRequests);

    // Managing view status of cards
    const [ viewStatus, setViewStatus ] = useState("ALL");

    /* Identity request create process
        Things needed - Reason,
                        Nic number, Grama division
    */

    // Managing the state for the modal
    const [postModal, setPostModal] = useState(false);

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
    }, [viewStatus]);

    // View individual request
    const [ showReq, setShowReq ] = useState(false);
    const [ showingDetail, setShowingDetail ] = useState(null);

    // Handle individual showing component
    function showDetailRequest(details){
        setShowingDetail(details);
        setShowReq(true);
    }


    return (<>
        {/* Identity request create modal */}
            <Modal open={postModal} onClose={() => setPostModal(false)}>
                <ModalDialog sx={{ padding: "0px", overflow: "hidden" }}>
                    <Box sx={{ height: "15px",
                    background: (theme) =>
                    `linear-gradient(to top, ${theme.vars.palette["main"][800]}, ${theme.vars.palette["main"][500]})`,    
                    }}></Box>
                    <Box sx={{ padding: "16px"}}>
                        <Typography level="h2">Create new Police request!</Typography>
                        <Grid container spacing={2} sx={{ flexGrow: 1, marginTop: "16px" }}>
                            <Grid md={12}>
                                <FormControl>
                                    <FormLabel>Reason applying</FormLabel>
                                    <Input placeholder="Your reason" /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>NIC</FormLabel>
                                    <Input placeholder="200107800876" /> 
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
            showReq && <ViewPoliceModal viewOpen={showReq} setViewOpen={setShowReq} details={showingDetail} />
        }
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography level="h2">Hii! {state.displayName}</Typography>
                <Button color="main" size="sm" variant="solid" startDecorator={<AddIcon />} onClick={() => setPostModal(true)}>New Police Request</Button> 
            </Box>
            <Chip color="primary" size="sm" variant="soft" sx={{ marginTop: "4px", marginBottom: "12px" }}>Email - {state.email}</Chip>
            {/* Recent police requests */}
            <Divider /> 
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ marginTop: "18px", marginBottom: "8px" }}>
                <Typography level="h2">Police Requests</Typography>
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
                    viewReqs.length > 0 && viewReqs.map((req, index) => <PoliceCard index={index} details={req} showDetails={() => showDetailRequest(req)}/>)
                }
                {
                    viewReqs.length < 1 && (
                        <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginTop: "24px", width: "100%"}}>
                            <Card component="li" sx={{ width: 100, height: 100, border: 0 }}>
                                <CardCover>
                                <img
                                    src={emptyRequestImg}
                                    style={{ objectFit: "fill"}}
                                />
                                </CardCover>
                            </Card>
                            <Typography level="body-sm">New requests will be shown here!</Typography>
                        </Box>
                    )
                }
            </Box>
        </Box>
    </>);
}

export default PolicePage;