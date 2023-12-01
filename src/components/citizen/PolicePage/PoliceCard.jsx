import { Card, Typography, Chip, Box, Button } from "@mui/joy";
import ClearIcon from '@mui/icons-material/Clear';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
/*
    Identity card - getting at glance details of identities
    Data which needs to be fetched from backend
        requestId, reason, nic, grama-division
*/

function PoliceCard({ index, details, showDetails }){
    const status = details["status"];
    let color = status === "PENDING" ? "primary" : (status === "VERIFIED" ? "success" : "danger" )

    return <>
        <Card variant="outlined" key={index} value={index} color={color} sx={{ 
            marginX: "4px",
            marginY: "4px",
            width: "250px",
            '&:hover': { boxShadow: 'md', borderColor: `${color}.outlinedHoverBorder` }
            }}>
            <Box>
                <Box display="flex" alignItems="center" justifyContent="start">
                    <LocalPoliceIcon fontSize="sm" color="neutral"/>
                    &nbsp;
                    <Typography level="body-sm" alignItems="center">
                        Police Request
                    </Typography>
                </Box>
                <Typography level="h4">Applied date: {details["applied-date"]}</Typography>
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

export default PoliceCard;