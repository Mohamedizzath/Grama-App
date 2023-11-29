import { Box, Button, List, ListItem, ListItemContent, Sheet, Typography } from "@mui/joy";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';

function Sidebar({ currentPage, changePage }){
    return (
        <Box maxWidth="max-content" sx={{ minHeight: "calc(100vh - 68px)"}}>
            <Typography variant="h3" fontSize="sm" sx={{ marginLeft: "28px", marginTop: "16px"}}>Quick Navigations</Typography>
            <List sx={{ padding: "0px"}}>
                <ListItem>
                    <ListItemContent>
                        <Button color="main" variant={currentPage === "IDENTITY-REQ" ? "solid" : "soft"} startDecorator={<AccountCircleIcon/>} sx={{ minWidth: "100%", justifyContent: "left"}} onClick={() => changePage("IDENTITY-REQ")}>Identity request</Button>
                    </ListItemContent>
                </ListItem>
                <ListItem>
                    <ListItemContent>
                        <Button color="main" variant={currentPage === "ADDRESS-REQ" ? "solid" : "soft"} startDecorator={<LocationOnIcon/>} sx={{ minWidth: "100%", justifyContent: "left"}} onClick={() => changePage("ADDRESS-REQ")}>Address request</Button>
                    </ListItemContent>
                </ListItem>
                <ListItem>
                    <ListItemContent>
                        <Button color="main" variant={currentPage === "POLICE-REQ" ? "solid" : "soft"} startDecorator={<LocalPoliceIcon/>} sx={{ minWidth: "100%", justifyContent: "left"}} onClick={() => changePage("POLICE-REQ")}>Police request</Button>
                    </ListItemContent>
                </ListItem>
            </List>
        </Box>);
}

export default Sidebar;