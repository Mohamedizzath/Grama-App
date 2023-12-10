import { Typography, Box, Button, Chip, Divider, Card, CardCover, Select, Option, FormControl, FormLabel, Grid, Input, Modal, ModalDialog, Snackbar, Skeleton, } from "@mui/joy";
import { useAuthContext } from "@asgardeo/auth-react";
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from "react";
import addressRequests from "../../test-data/addressRequests";
import AddressCard from "./AddressPage/AddressCard";
import ViewAddressModal from "./AddressPage/ViewAddressModal";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import emptyRequestImg from "../../assets/empty-requests.svg";
import axios from "axios";
import ErrorHandler from "../ErrorHandler";

function AddressPage(){
    const { state, getAccessToken } = useAuthContext();

    /* Address request create process
        Things needed - Address,
                        Nic number, Grama division
    */

    // Fetching id requests for the first time
    useEffect(() => {
        initialLoad();
    }, []);

    // Error handling
    const [showError, setShowError] = useState(false);
    const [errorModal, setErrorModal] = useState(<ErrorHandler showError={showError} errorCode={null} />);

    async function initialLoad(){
        let response = await fetch('https://api.asgardeo.io/t/interns/oauth2/userinfo', {
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`
            }
        });

        if(response.ok){
            const json = await response.json();
            const NIC = json.nic;

            sessionStorage.setItem('User-NIC', NIC);
            // Setting post modal nic
            setPostModalData({...postModalData, NIC: NIC});
        } else {
            // Error occured 
            if(response.status === 401){
                setErrorModal(<ErrorHandler showError={showError} errorCode={401} />);
            } else {
                setErrorModal(<ErrorHandler showError={showError} errorCode={401} />);
            }
            setShowError(true);
        }

        // Second function call to get grama divisions
        response = await axios({ 
            method: 'get',
            url: `${window.config.apiGatewayUrl}/gramadivisions`,
            responseType: "json",
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`,
            }
        });

        if(response.status === 200){
            // Set up select options
            const divisions = response.data;
            setDivionSelect(divisions);
        } else {
            // Error occured 
            if(response.status === 401){
                setErrorModal(<ErrorHandler showError={showError} errorCode={401} />);
            } else {
                setErrorModal(<ErrorHandler showError={showError} errorCode={401} />);
            }
            setShowError(true);
        }

        // Second function call to get all the requests
        response = await axios({
            method: 'get',
            url: `${window.config.apiGatewayUrl}/address/requests/nic/${sessionStorage.getItem('User-NIC')}`,
            responseType: "json",
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`,
            }
        });

        if(response.status === 200){
            setAddressReqs(response.data);
            setViewAddressReqs(response.data);

            setShowSkeletonCards(false);
        } else {
            // Error occured 
            if(response.status === 401){
                setErrorModal(<ErrorHandler showError={showError} errorCode={401} />);
            } else {
                setErrorModal(<ErrorHandler showError={showError} errorCode={401} />);
            }
            setShowError(true);
        }
    }

    // Managing the state for the modal
    const [postModal, setPostModal] = useState(false);
    const [postModalData, setPostModalData] = useState(postModalDefault);
    const [addressDataError, setAddressDataError] = useState(null);
    const [divionSelect, setDivionSelect] = useState(null);

    // Handling post data the post data
    // Debugging postmodal data
    useEffect(() => {
        const valid = checkPostModalData();

        if(valid){
            setAddressDataError(null);
        }
    }, [postModalData]);

    function checkPostModalData(){
        // Handling post modal
        
        if(!postModalData.address || (postModalData.address && postModalData.address.length < 1)){
            setAddressDataError("address");
            return false;
        } else if(!postModalData.gramaDivision){
            setAddressDataError("gramasevaka_division");
            return false;
        } 

        return true;
    }

    // Handling post address request
    const [postSnack, setPostSnack] = useState(false);
    const [postSnackObj, setPostSnackObj] = useState({ color: "neutral", msg: ""});

    const [savingReq, setSavingReq] = useState(false);

    async function handlePostModal(){
        // Setting saving request
        setSavingReq(true);
        const reqBody = postModalData;

        const response = await axios({ 
            method: 'post',
            url: `${window.config.apiGatewayUrl}/address/requests`,
            data: reqBody,
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`,
            }
        });

        if(response.status === 201){
            setPostSnack(true);
            setPostSnackObj({ color: "success", msg: "Address request successfully added"});
        } else {
            setPostSnack(true);
            setPostSnackObj({ color: "danger", msg: "Error occured when Address request creation"});
        }

        setSavingReq(false);
        
        setPostModal(false);
        initialLoad();
    }
    

    // Managing the status of address requests
    const [ viewStatus, setViewStatus ] = useState("ALL");

    const [ addressReqs, setAddressReqs ] = useState([]);
    const [ viewaddressReqs, setViewAddressReqs ] = useState([]);

    const [showSkeletonCards, setShowSkeletonCards] = useState(true);
    
    // Managing req cards
    useEffect(() => {
        let tempReq = [];
        if(viewStatus === "PENDING"){
            tempReq = addressReqs.filter(req => req["status"] === "Pending");
        } else if(viewStatus === "VERIFIED"){
            tempReq = addressReqs.filter(req => req["status"] === "Verified");
        } else if(viewStatus === "REJECTED"){
            tempReq = addressReqs.filter(req => req["status"] === "Rejected");
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
        // Getting grama divison
        const division = divionSelect.filter(division => division.id === details.gramadivisionId);

        details = {...details, division: division[0]};

        setShowingDetail(details);
        setShowReq(true);
    }

    // Delete identity request
    async function deleteAddressReq(requestId){
        const response = await axios({ 
            method: 'delete',
            url: `${window.config.apiGatewayUrl}/address/requests/${requestId}`,
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`,
            },
        });

        if(response.status === 200){
            setPostSnack(true);
            setPostSnackObj({ color: "success", msg: "Address request successfully deleted"});
        } else {
            setPostSnack(true);
            setPostSnackObj({ color: "danger", msg: "Error occured when deleting address request"});
        }

        setShowingDetail(null);
        setShowReq(false);

        initialLoad();
    }

    return (<>
        <Box>
            {/* Error modal */}
            {errorModal}
            {/* Address request create modal */}
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
                                    <Input color={addressDataError === "address" ? "danger" : "neutral"} value={postModalData["address"]} onChange={(e) => setPostModalData({...postModalData, address: e.target.value})} /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>NIC</FormLabel>
                                    <Input value={postModalData["NIC"]} /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Grama division</FormLabel>
                                    <Select color={addressDataError === "gramasevaka_division" ? "danger" : "neutral"} placeholder="Select division" value={postModalData["gramaDivision"]} onChange={(e, value) => setPostModalData({...postModalData, gramaDivision: value})}>
                                        {
                                            divionSelect && divionSelect.map(division => <Option key={division["id"]} value={division["id"]}>{division["GN_division"] + "(" + division["DS_division"] + ")"} </Option>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid md={12} display="flex" justifyContent="center" sx={{ marginTop: "12px"}}>
                                <Button color="main" variant="soft" startDecorator={<CloseIcon/>} disabled={savingReq} onClick={() => setPostModal(false)}>Cancel</Button>
                                <Button color="main" variant="solid" startDecorator={<CheckIcon/>} disabled={addressDataError || savingReq ? true : false} sx={{ marginLeft: "8px" }} onClick={handlePostModal}>Create</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </ModalDialog>
            </Modal>
            <Snackbar autoHideDuration={3000} open={postSnack} color={postSnackObj.color} variant="soft" onClose={
                (event, reason) => {
                    if(reason === "clickaway"){
                        return;
                    } else {
                        setPostSnack(false);
                    }
                }
            }>
                {postSnackObj.msg}
                </Snackbar>
            {
                showReq && <ViewAddressModal viewOpen={showReq} setViewOpen={setShowReq} details={showingDetail} deleteReq={deleteAddressReq} />
            }
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography level="h2">Hii! {state.displayName}</Typography>
                <Button color="main" size="sm" variant="solid" startDecorator={<AddIcon />} onClick={() => setPostModal(true)}>New Address Request</Button> 
            </Box>
            <Chip color="primary" size="sm" variant="soft" sx={{ marginTop: "4px", marginBottom: "12px" }}>Email - {state.email}</Chip>
            {/* Recent Address requests */}
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
                    showSkeletonCards && [...Array(6).keys()].map(() => (
                    <Card sx={{ width: "250px", height: "150px", marginX: "4px", marginY: "4px", display: 'flex', padding: 0,}}>
                        <Skeleton />
                    </Card>
                    ))
                }
                {
                    !showSkeletonCards && viewaddressReqs.length > 0 && viewaddressReqs.map((req, index) => <AddressCard index={index} details={req} showDetails={showDetailRequest} deleteReq={deleteAddressReq}/>)
                }
                {/* Add empty reqs array placeholder */}
                {
                    !showSkeletonCards && viewaddressReqs.length < 1 && (
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

const postModalDefault = {
    "NIC": "200107800876",
    "address": "Your address",
    "gramaDivision": ""
}

export default AddressPage;