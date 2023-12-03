import { Card, Typography, Chip, Box, Button } from "@mui/joy";
import ClearIcon from '@mui/icons-material/Clear';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
/*
    Identity card - getting at glance details of identities
    Data which needs to be fetched from backend
        requestId, full-name, full-name-initials, nic, gender
        contact number, email, address, dob, grama-division
*/

function IdentityCard({ index, details, showDetails }){
    const status = details["status"];
    let color = status === "Pending" ? "primary" : (status === "Verified" ? "success" : "danger" );

    // Formatting the date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(details["applied_date"][0]).toLocaleDateString("en-US", options);

    return <>
        <Card variant="outlined" key={index} value={index} color={color} sx={{ 
            marginX: "4px",
            marginY: "4px",
            width: "250px",
            '&:hover': { boxShadow: 'md', borderColor: `${color}.outlinedHoverBorder` }
            }}>
            <Box>
                <Box display="flex" alignItems="center" justifyContent="start">
                    <AccountCircleIcon fontSize="sm" color="neutral"/>
                    &nbsp;
                    <Typography level="body-sm" alignItems="center">
                        Identity Request
                    </Typography>
                </Box>
                <Typography level="h4">Applied date: {date}</Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start" alignItems="center">
                <Chip color={color} size="sm">Status - {details["status"]}</Chip>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center">
                {
                    status === "PENDING" && <Button color={color} variant="soft" size="sm" sx={{ marginRight: "4px" }} startDecorator={<ClearIcon />}>Delete</Button>
                }
                <Button color={color} variant="solid" size="sm" endDecorator={<ArrowForwardIcon/>} onClick={() => showDetails(details)}>View Details</Button>
            </Box>
        </Card>
    </>;
}

export default IdentityCard;