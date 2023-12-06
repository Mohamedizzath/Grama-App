import { useAuthContext } from "@asgardeo/auth-react";
import { Box, Button, Chip, FormControl, FormLabel, Grid, Input, Modal, ModalDialog, Option, Select, Divider, Card, CardCover, Skeleton, Snackbar } from "@mui/joy";
import { Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import identityReqs from "../../test-data/identityRequest";
import IdentityCard from "./IdentityPage/IdentityCard";
import ViewIdentityModal from "./IdentityPage/ViewIdentityModal";
import emptyRequestImg from "../../assets/empty-requests.svg";
import axios from "axios";

function IdentityPage(){
    const { state, getAccessToken } = useAuthContext();

    // Handling errors occurs in the identity page
    const [showError, setShowError] = useState(false);

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
    const [postModalData, setPostModalData] = useState(postModalDefault);
    const [identityDataError, setIdentityDataError] = useState(null);
    const [divionSelect, setDivionSelect] = useState(null);

    // Opening identity request create modal
    async function openPostModal(){
        if(divionSelect){
            // Grama divisios already fetched!
            setPostModalData({...postModalData, gramasevaka_division: divionSelect[0].id});

            setPostModal(true);
            return;
        }


        const response = await axios({ 
            method: 'get',
            url: `${window.config.apiGatewayUrl}/gramadivisions`,
            responseType: "json",
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`,
            }
        });

        if(response.status === 200){
            // Set up select options
            const divisons = response.data;
            setDivionSelect(divisons);
            setPostModalData({...postModalData, gramasevaka_division: divisons[0].id});

            setPostModal(true);
        } else {
            // Error occured 
            setShowError(true);
        }
        
    }

    // Debugging the grama divisions
    useEffect(() => {
        console.log('Division select!');
        console.log(divionSelect);
    }, [divionSelect]);

    useEffect(() => {
        const valid = checkPostModalData();

        if(valid){
            setIdentityDataError(null);
        }
    }, [postModalData]);

    function checkPostModalData(){
        // Handling post modal
        const olcNicRegex = /^[0-9]{9}(V|X)$/;
        const newNicRegex = /^[0-9]{12}$/;

        const contactRegex = /^[0-9]{10}$/;
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if(postModalData.initials_fullname.length < 1){
            setIdentityDataError("initials_fullname");
            return false;
        } else if(postModalData.fullname.length < 1){
            setIdentityDataError("fullname");
            return false;
        } else if(!olcNicRegex.test(postModalData.NIC) && !newNicRegex.test(postModalData.NIC)){
            setIdentityDataError("NIC");
            return false;
        } else if(!contactRegex.test(postModalData.contact_num)){
            setIdentityDataError("contact_num");
            return false;
        } else if(!emailRegex.test(postModalData.email)){
            setIdentityDataError("email");
            return false;
        } else if(!postModalData.address || (postModalData.address && postModalData.address.length < 1)){
            setIdentityDataError("address");
            return false;
        }

        return true;
    }

    const [savingReq, setSavingReq] = useState(false);

    // Handling post identity request
    const [postSnack, setPostSnack] = useState(false);
    const [postSnackObj, setPostSnackObj] = useState({ color: "neutral", msg: ""});

    async function handlePostModal(){
        // Setting saving request
        setSavingReq(true);
        const dob = new Date(postModalData.DOB);
        const year = dob.getFullYear();
        const month = dob.getMonth();
        const date = dob.getDate();

        const epoch = new Date(year, month, date).getTime() / 1000;

        const reqBody = {...postModalData, DOB: [epoch, 0]};

        const response = await axios({ 
            method: 'post',
            url: `${window.config.apiGatewayUrl}/identity/requests`,
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`,
            },
            data: reqBody,
        });

        if(response.status === 201){
            setPostSnack(true);
            setPostSnackObj({ color: "success", msg: "Identity request successfully added"});
        } else {
            setPostSnack(true);
            setPostSnackObj({ color: "danger", msg: "Error occured when identity request creation"});
        }

        setSavingReq(false);
        
        setPostModal(false);
        initialLoad();
    }

    // Handle get identity requests
    const [idReqs, setIdReqs] = useState(null);
    const [viewReqs, setViewReq] = useState(null);

    const [showSkeletonCards, setShowSkeletonCards] = useState(true);
    

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
            setPostModalData({...postModalData, NIC: NIC});
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
            url: `${window.config.apiGatewayUrl}/identity/requests/nic/${sessionStorage.getItem('User-NIC')}`,
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
    }


    // Managing view status of cards
    const [ viewStatus, setViewStatus ] = useState("ALL");

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
        const division = divionSelect.filter(division => division.id === details.grama_divisionId);

        details = {...details, division: division[0]};

        setShowingDetail(details);
        setShowReq(true);
    }

    // Delete identity request
    async function deleteIdentityReq(requestId){
        const response = await axios({ 
            method: 'delete',
            url: `${window.config.apiGatewayUrl}/identity/requests/${requestId}`,
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`,
            },
        });

        if(response.status === 200){
            setPostSnack(true);
            setPostSnackObj({ color: "success", msg: "Identity request successfully deleted"});
        } else {
            setPostSnack(true);
            setPostSnackObj({ color: "danger", msg: "Error occured when deleting identity request"});
        }

        setShowingDetail(null);
        setShowReq(false);

        initialLoad();
    }

    return (<>
        <Box>
            {/* Error modal */}

        <Modal open={showError}>
            <ModalDialog
                aria-labelledby="nested-modal-title"
                aria-describedby="nested-modal-description"
                sx={(theme) => ({
                [theme.breakpoints.only('xs')]: {
                    top: 'unset',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderRadius: 0,
                    transform: 'none',
                    maxWidth: 'unset',
                },
                })}
            >
                <Typography id="nested-modal-title" level="h2">
                    Oops, Internal server error!
                </Typography>
                <Typography id="nested-modal-description" textColor="text.tertiary">
                    Looks like internal server having some issue. Please try again later.
                </Typography>
                <Box
                sx={{
                    mt: 1,
                    display: 'flex',
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row-reverse' },
                }}
                >
                <Button variant="solid" color="main" onClick={() => window.location.reload()}>
                    Refresh page
                </Button>
                </Box>
            </ModalDialog>
            </Modal>

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
                                    <Input color={identityDataError === "initials_fullname" ? "danger" : "neutral"} value={postModalData["initials_fullname"]} onChange={(e) => setPostModalData({...postModalData, initials_fullname: e.target.value})} /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Full name(without initials)</FormLabel>
                                    <Input color={identityDataError === "fullname" ? "danger" : "neutral"} value={postModalData["fullname"]} onChange={(e) => setPostModalData({...postModalData, fullname: e.target.value})} /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>NIC number</FormLabel>
                                    <Input color={identityDataError === "NIC" ? "danger" : "neutral"} value={postModalData["NIC"]} disabled={true}/> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Gender</FormLabel>
                                    <Select placeholder="Select Gender" value={postModalData["gender"]} onChange={(e, value) => setPostModalData({...postModalData, gender: value})}>
                                        <Option key="MALE" value="MALE">Male</Option>
                                        <Option key="FEMALE" value="FEMALE">Female</Option>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Contact number</FormLabel>
                                    <Input color={identityDataError === "contact_num" ? "danger" : "neutral"} value={postModalData["contact_num"]} onChange={(e) => setPostModalData({...postModalData, contact_num: e.target.value})}/> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input color={identityDataError === "email" ? "danger" : "neutral"} value={postModalData["email"]} onChange={(e) => setPostModalData({...postModalData, email: e.target.value})}/> 
                                </FormControl>
                            </Grid>
                            <Grid md={12}>
                                <FormControl>
                                    <FormLabel>Address</FormLabel>
                                    <Input color={identityDataError === "address" ? "danger" : "neutral"} value={postModalData["address"]}  onChange={(e) => setPostModalData({...postModalData, address: e.target.value})}/> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Date of birth</FormLabel>
                                    <Input type="date" value={postModalData["DOB"]} onChange={(e) => setPostModalData({...postModalData, DOB: e.target.value})} /> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Grama division</FormLabel>
                                    <Select placeholder="Select division" value={postModalData["gramasevaka_division"]} onChange={(e, value) => setPostModalData({...postModalData, gramasevaka_division: value})}>
                                        {
                                            divionSelect && divionSelect.map(division => <Option key={division["id"]} value={division["id"]}>{division["GN_division"] + "(" + division["DS_division"] + ")"} </Option>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid md={12} display="flex" justifyContent="center" sx={{ marginTop: "12px"}}>
                                <Button color="main" variant="soft" startDecorator={<CloseIcon/>} disabled={savingReq} onClick={() => setPostModal(false)}>Cancel</Button>
                                <Button color="main" variant="solid" startDecorator={<CheckIcon/>} disabled={identityDataError || savingReq ? true : false} sx={{ marginLeft: "8px" }} onClick={handlePostModal}>Create</Button>
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
            {/* Individual request showing modal */}
            {
                showReq && <ViewIdentityModal viewOpen={showReq} setViewOpen={setShowReq} details={showingDetail} deleteReq={deleteIdentityReq} />
            }
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography level="h2">Hii! {state.displayName}</Typography>
                <Button color="main" size="sm" variant="solid" startDecorator={<AddIcon />} onClick={openPostModal}>New Identity Request</Button> 
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
                    showSkeletonCards && [...Array(6).keys()].map(() => (
                    <Card sx={{ width: "250px", height: "150px", marginX: "4px", marginY: "4px", display: 'flex', padding: 0,}}>
                        <Skeleton />
                    </Card>
                    ))
                }
                {
                    !showSkeletonCards && viewReqs.length > 0 && viewReqs.map((req, index) => <IdentityCard index={index} details={req} showDetails={showDetailRequest} deleteReq={deleteIdentityReq}/>)
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
    "initials_fullname": "P.M. Kamal Perera",
    "fullname": "Pasan Madawa Kamal Perera",
    "NIC": "200107800876",
    "gender": "MALE",
    "contact_num": "0711123232",
    "email": "email@example.com",
    "address": "Your address",
    "DOB": new Date(),
    "gramasevaka_division": "",
}

export default IdentityPage;