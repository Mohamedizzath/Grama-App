import { Modal, ModalDialog, Box, Typography, Grid, FormControl, FormLabel, Input, Button, Select, Option, Chip } from "@mui/joy";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AlarmIcon from '@mui/icons-material/Alarm';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function ViewAddressModal({ viewOpen, setViewOpen, details, deleteReq }){
    let headerTheme = "primary";
    let chipIcon = null;
    let chipDisplay = "Pending";

    if(details["status"] === "Verified"){
        headerTheme = "success";
        chipIcon = <CheckIcon/>
        chipDisplay = "Verified";
    } else if(details["status"] === "Rejected"){
        headerTheme = "danger";
        chipIcon = <CloseIcon />
        chipDisplay = "Rejected"
    } else {
        headerTheme = "primary";
        chipIcon = <AlarmIcon />
        chipDisplay = "Pending";
    }

    // Formatting the date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(details["applied_date"][0] * 1000).toLocaleDateString("en-US", options);
    const approvedDate = new Date(details["approved_date"][0] * 1000).toLocaleDateString("en-US", options);

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
                            <Typography level="h2">Applied date: {date}</Typography>
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
                                    <FormLabel>NIC number</FormLabel>
                                    <Input value={details["NIC"]}/> 
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl>
                                    <FormLabel>Grama divison</FormLabel>
                                    <Input value={details["division"]["GN_division"] + "(" + details["division"]["DS_division"] + ")"}/> 
                                </FormControl>
                            </Grid>
                            {
                                details["status"] !== "Pending" && (
                                    <Grid xs={12} md={12}>
                                        {
                                            details["status"] === "Verified" && (
                                                <>
                                                    <Typography level="body-sm">Request status details</Typography>
                                                    <Box display="flex" justifyContent="space-between" alignItems="center">  
                                                        <Box display="flex" flexDirection="column">
                                                            <Typography level="h4">Approved by - {details["approved_by"]}</Typography>
                                                            <Typography level="body-sm">Approved date - {approvedDate}</Typography> 
                                                            </Box>
                                                    </Box>
                                                </>
                                            )
                                        }
                                        {
                                            details["status"] === "Rejected" && (
                                                <>
                                                    <Typography level="body-sm">Request status details</Typography>
                                                    <Box display="flex" justifyContent="space-between" alignItems="center">  
                                                        <Box display="flex" flexDirection="column">
                                                            <Typography level="h4">Rejected by - {details["approved_by"]}</Typography>
                                                            <Typography level="body-sm">Rejected date - {approvedDate}</Typography> 
                                                        </Box>
                                                    </Box>
                                                </>
                                            )
                                        }
                                    </Grid>
                                )
                            }
                            <Grid md={12} display="flex" justifyContent="center" sx={{ marginTop: "12px"}}>
                                {
                                    details["status"] === "Pending" && <Button color={headerTheme} variant="soft" startDecorator={<DeleteIcon/>} onClick={() => deleteReq(details["id"])}>Delete Request</Button>
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