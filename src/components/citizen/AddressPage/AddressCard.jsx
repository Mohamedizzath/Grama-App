import { Card, Typography, Chip, Box, Button } from "@mui/joy";
import ClearIcon from '@mui/icons-material/Clear';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CircleIcon from '@mui/icons-material/Circle';
/*
    Address card - getting at glance details of identities
    Data which needs to be fetched from backend
        requestId, address, grama-division, applied-date, status, approved-by
*/

function AddressCard({ index, details, showDetails, deleteReq }){
    const status = details["status"];
    let color = status === "Pending" ? "primary" : (status === "Verified" ? "success" : "danger" );

    // Formatting the date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const contDate = new Date(details["applied_date"][0] * 1000).toLocaleDateString("en-US", options);

    return <>
        <Card variant="outlined" key={index} value={index} color={color} sx={{ 
            marginX: "4px",
            marginY: "4px",
            width: "250px",
            '&:hover': { boxShadow: 'md', borderColor: `${color}.outlinedHoverBorder` }
            }}>
            <Box>
            <Box display="flex" alignItems="center" justifyContent="start">
                    <LocationOnIcon fontSize="sm" color="neutral"/>
                    &nbsp;
                    <Typography level="body-sm" alignItems="center">
                        Address Request
                    </Typography>
                </Box>
                <Typography level="h4">Applied date: {contDate}</Typography>
                <Typography level="body-sm">Address - {details["address"]}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Chip color="neutral" size="sm" startDecorator={<CircleIcon fontSize="sm" />}>{details["NIC"]}</Chip>
                <Chip color={color} size="sm">Status - {details["status"]}</Chip>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center">
                {
                    status === "Pending" && <Button color={color} variant="soft" size="sm" sx={{ marginRight: "4px" }} startDecorator={<ClearIcon />} onClick={() => deleteReq(details["id"])}>Delete</Button>
                }
                <Button color={color} variant="solid" size="sm" endDecorator={<ArrowForwardIcon/>} onClick={() => showDetails(details)}>View Details</Button>
            </Box>
        </Card>
    </>;
}

export default AddressCard;