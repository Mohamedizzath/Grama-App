import { Typography, Box, Button, Chip, Divider, Select, Option, FormControl, FormLabel, Grid, Input, Modal, ModalDialog, } from "@mui/joy";
import { useAuthContext } from "@asgardeo/auth-react";
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from "react";
import addressRequests from "../../test-data/addressRequests";
import AddressCard from "./AddressPage/AddressCard";
import ViewAddressModal from "./AddressPage/ViewAddressModal";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

function AddressPage(){
    const { state } = useAuthContext();

    /* Identity request create process
        Things needed - Address,
                        Nic number, Grama division
    */

    // Managing the state for the modal
    const [postModal, setPostModal] = useState(false);

    // Managing the status of address requests
    const [ viewStatus, setViewStatus ] = useState("ALL");

    const [ addressReqs, setAddressReqs ] = useState(addressRequests);
    const [ viewaddressReqs, setViewAddressReqs ] = useState(addressReqs);
    
    // Managing req cards
    useEffect(() => {
        let tempReq = [];
        if(viewStatus === "PENDING"){
            tempReq = addressReqs.filter(req => req["status"] === "PENDING");
        } else if(viewStatus === "VERIFIED"){
            tempReq = addressReqs.filter(req => req["status"] === "VERIFIED");
        } else if(viewStatus === "REJECTED"){
            tempReq = addressReqs.filter(req => req["status"] === "REJECTED");
        } else {
            tempReq = addressReqs;
        }

        setViewAddressReqs(tempReq);
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
        <Box>
            {/* Identity request create modal */}
            <Modal open={postModal} onClose={() => setPostModal(false)}>
                <ModalDialog sx={{ padding: "0px", overflow: "hidden" }}>
                    <Box sx={{ height: "15px",
                    background: (theme) =>
                    `linear-gradient(to top, ${theme.vars.palette["main"][800]}, ${theme.vars.palette["main"][500]})`,    
                    }}></Box>
                    <Box sx={{ padding: "16px"}}>
                        <Typography level="h2">Create new Address request!</Typography>
                        <Grid container spacing={2} sx={{ flexGrow: 1, marginTop: "16px" }}>
                            <Grid md={12}>
                                <FormControl>
                                    <FormLabel>Address</FormLabel>
                                    <Input placeholder="Your address" /> 
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
            {
                showReq && <ViewAddressModal viewOpen={showReq} setViewOpen={setShowReq} details={showingDetail} />
            }
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography level="h2">Hii! {state.displayName}</Typography>
                <Button color="main" size="sm" variant="solid" startDecorator={<AddIcon />} onClick={() => setPostModal(true)}>New Address Request</Button> 
            </Box>
            <Chip color="primary" size="sm" variant="soft" sx={{ marginTop: "4px", marginBottom: "12px" }}>Email - {state.email}</Chip>
            {/* Recent Identity requests */}
            <Divider />
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ marginTop: "18px", marginBottom: "8px" }}>
                <Typography level="h2">Address Requests</Typography>
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
                    viewaddressReqs.map((req, index) => <AddressCard index={index} details={req} showDetails={showDetailRequest}/>)
                }
                {/* Add empty reqs array placeholder */}
            </Box>
        </Box>
    </>);
}

export default AddressPage;