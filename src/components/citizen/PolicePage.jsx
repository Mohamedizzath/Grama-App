import { Box, Button, Chip, Divider, Typography, Select, Option, Modal, ModalDialog, Grid, FormControl, FormLabel, Input, Card, Skeleton, Tooltip, Snackbar } from "@mui/joy";
import { useAuthContext } from "@asgardeo/auth-react";
import AddIcon from '@mui/icons-material/Add';
import policeRequests from "../../test-data/policeRequests";
import { useState, useEffect } from "react";
import PoliceCard from "./PolicePage/PoliceCard";
import ViewPoliceModal from "./PolicePage/ViewPoliceModal";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import axios from "axios";

function PolicePage(){
    const { state, getAccessToken } = useAuthContext();

    // Handle get identity requests
    const [idReqs, setIdReqs] = useState(policeRequests);
    const [viewReqs, setViewReq] = useState(policeRequests);

    const [showSkeletonCards, setShowSkeletonCards] = useState(true);
    const [postButtonDisable, setPostButtonDisable] = useState(true);
    const [postDisableMsg, setPostDisableMsg] = useState("");

    // Managing view status of cards
    const [ viewStatus, setViewStatus ] = useState("ALL");

    // Fetching id requests for the first time
    useEffect(() => {
        initialLoad();
    }, []);

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
            setPostModalData({...postModalData, nic: NIC});
        } else {
            // Error occured 
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
            setShowError(true);
        }

        // Second function call to get all the requests
        response = await axios({
            method: 'get',
            url: `${window.config.apiGatewayUrl}/police/requests/nic/${sessionStorage.getItem('User-NIC')}`,
            responseType: "json",
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`,
            },
        });

        if(response.status === 200){
            setIdReqs(response.data);
            setViewReq(response.data);

            setShowSkeletonCards(false);
        } else {
            // Error occured 
            setShowError(true);
        }

        

        // Checking the whether address and identity request exists
        response = await axios({
            method: 'get',
            url: `${window.config.apiGatewayUrl}/identity/requests/validate/${sessionStorage.getItem('User-NIC')}`,
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`,
            },
        });

        if(response.status === 200){
            if(response.data === false){
                setPostButtonDisable(true);
                setPostDisableMsg("You should have verified identity request");
                return;
            } 
        } else {
            // Error occured 
            setShowError(true);
        }

        response = await axios({
            method: 'get',
            url: `${window.config.apiGatewayUrl}/address/requests/validate/${sessionStorage.getItem('User-NIC')}`,
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`,
            },
        });

        if(response.status === 200){
            if(response.data === false){
                setPostButtonDisable(true);
                setPostDisableMsg("You should have verified address request");
                return;
            } 
        } else {
            // Error occured 
            setShowError(true);
        }

        setPostButtonDisable(false);
        setPostDisableMsg("");
    }

    /* Identity request create process
        Things needed - Reason,
                        Nic number, Grama division
    */

    // Managing the state for the modal
    // Managing the state for the modal
    const [postModal, setPostModal] = useState(false);
    const [postModalData, setPostModalData] = useState(postModalDefault);
    const [addressDataError, setAddressDataError] = useState(null);
    const [divionSelect, setDivionSelect] = useState(null);

    useEffect(() => {
        const valid = checkPostModalData();

        if(valid){
            setAddressDataError(null);
        }
    }, [postModalData]);

    function checkPostModalData(){
        // Handling post modal
        
        if(postModalData.reason.length < 1){
            setAddressDataError("reason");
            return false;
        } else if(!postModalData.gid || postModalData.gid === ""){
            setAddressDataError("gid");
            return false;
        }

        return true;
    }

    // Managing req cards
    useEffect(() => {
        let tempReq = [];
        if(viewStatus === "PENDING"){
            tempReq = idReqs.filter(req => req["status"] === "Pending");
        } else if(viewStatus === "VERIFIED"){
            tempReq = idReqs.filter(req => req["status"] === "Verified");
        } else if(viewStatus === "REJECTED"){
            tempReq = idReqs.filter(req => req["status"] === "Rejected");
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
        // Getting grama divison
        const division = divionSelect.filter(division => division.id === details.gid);

        details = {...details, division: division[0]};

        setShowingDetail(details);
        setShowReq(true);
    }

    const [isSavingReq, setIsSavingReq] = useState(false);

    // Handling post identity request
    const [postSnack, setPostSnack] = useState(false);
    const [postSnackObj, setPostSnackObj] = useState({ color: "neutral", msg: ""});

    async function handlePostModal(){
        // Saving the post modal
        setIsSavingReq(true);

        const response = await axios({
            method: 'post',
            url: `${window.config.apiGatewayUrl}/police/requests`,
            data: postModalData,
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`,
            },
        });

        if(response.status === 201){
            setPostSnack(true);
            setPostSnackObj({ color: "success", msg: "Police request successfully created"});
        } else {
            setPostSnack(true);
            setPostSnackObj({ color: "danger", msg: "Error occured when creating police request"});
        }

        setIsSavingReq(false);

        setPostModal(false);
        initialLoad();
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
                                    <Input color={addressDataError === "reason" ? "danger" : "neutral"} value={postModalData["reason"]} onChange={(e) => setPostModalData({...postModalData, reason: e.target.value})}/> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>NIC</FormLabel>
                                    <Input value={postModalData["nic"]} /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Grama division</FormLabel>
                                    <Select color={addressDataError === "gid" ? "danger" : "neutral"}  placeholder="Select division" value={postModalData["gid"]} onChange={(e, value) => setPostModalData({...postModalData, gid: value})}>
                                        {
                                            divionSelect && divionSelect.map(division => <Option key={division["id"]} value={division["id"]}>{division["GN_division"] + "(" + division["DS_division"] + ")"} </Option>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid md={12} display="flex" justifyContent="center" sx={{ marginTop: "12px"}}>
                                <Button color="main" variant="soft" startDecorator={<CloseIcon/>} onClick={() => setPostModal(false)}>Cancel</Button>
                                <Button color="main" variant="solid" startDecorator={<CheckIcon/>} disabled={addressDataError || isSavingReq ? true : false} sx={{ marginLeft: "8px" }} onClick={handlePostModal}>Create</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </ModalDialog>
            </Modal>
        {/* Post Modal snack */}
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
        {/* Individual request showing modal */}
        {
            showReq && <ViewPoliceModal viewOpen={showReq} setViewOpen={setShowReq} details={showingDetail} />
        }
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography level="h2">Hii! {state.displayName}</Typography>
                {
                    postButtonDisable && (
                        <Tooltip title={postDisableMsg} variant="soft" color="warning">
                            <Button size="sm" variant="plain" color="warning" startDecorator={<AddIcon />}>New Police Request</Button> 
                        </Tooltip>
                    )
                }
                {
                    !postButtonDisable &&  <Button color="main" size="sm" variant="solid" startDecorator={<AddIcon />} onClick={() => setPostModal(true)} disabled={postButtonDisable}>New Police Request</Button> 
                }
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
                    showSkeletonCards && [...Array(6).keys()].map(() => (
                    <Card sx={{ width: "250px", height: "150px", marginX: "4px", marginY: "4px", display: 'flex', padding: 0,}}>
                        <Skeleton />
                    </Card>
                    ))
                }
                {
                    !showSkeletonCards && viewReqs.length > 0 && viewReqs.map((req, index) => <PoliceCard index={index} details={req} showDetails={() => showDetailRequest(req)}/>)
                }
                {
                    !showSkeletonCards && viewReqs.length < 1 && (
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
    "nic": "",
    "reason": "Reason for application",
    "gid": ""
}

export default PolicePage;