import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import { Container, Chip } from '@mui/joy';
import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";
import Badge from '@mui/joy/Badge';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Dropdown from '@mui/joy/Dropdown';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Sheet from '@mui/joy/Sheet';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router';
import FaceIcon from '@mui/icons-material/Face';
import OutputIcon from '@mui/icons-material/Output';

function Header({ secured, role }){
    // Authentication logic
    const { state, signOut, signIn, getAccessToken } = useAuthContext();
    const [ userRole, setUserRole ] = useState(undefined);
    const [open, setOpen] = useState(false);

    // Adding router navigation
    const navigate = useNavigate();

    useEffect(() => console.log(userRole), [userRole]);

    async function handleAuthorization(secured, role){
        // Rendering page is secured page
        if(state.isAuthenticated === true && secured === true){
            // Entered page is properly authenticated
            // Next step is to check the role

            try {
                const response = await fetch('https://api.asgardeo.io/t/wso2khadijah/oauth2/userinfo', {
                    headers: {
                        Authorization: `Bearer ${await getAccessToken()}`
                    }
                });
                
                if (response.ok) {
                    const json = await response.json();
                    const fetchedRole = json.application_roles;

                    if(!fetchedRole){
                        setUserRole("CITIZEN");
                        localStorage.setItem('User-Role', 'CITIZEN');
                    } else if(fetchedRole === "gramaSewaka") {
                        setUserRole("GRAMA-SEWAKA");
                        localStorage.setItem('User-Role', 'GRAMA-SEWAKA');
                    }

                    // Checking the role
                    if(secured){
                        if(role === userRole){
                            return true;
                        } else {
                            // Invalid permission - redirect to logout 
                            setOpen(true);
                        }
                    } else {
                        return true;
                    }
                } else {
                    console.error('Error:', response.statusText);
                    signIn();
                }
            } catch (error) {
                console.error('Error:', error);
                signIn();
            }
        } else if(state.isAuthenticated === false && secured === true) {
            // Redirect to authentication process
            signIn();
        } else if(secured === false){
            return true;
        }
    }

    useEffect(() => {
        handleAuthorization(secured, role);
    }, []);

    return (<>
        <Modal open={open} onClose={() => setOpen(false)}>
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
            Are you absolutely sure?
            </Typography>
            <Typography id="nested-modal-description" textColor="text.tertiary">
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
            </Typography>
            <Box
            sx={{
                mt: 1,
                display: 'flex',
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row-reverse' },
            }}
            >
            <Button variant="solid" color="primary" onClick={() => setOpen(false)}>
                Continue
            </Button>
            <Button
                variant="outlined"
                color="neutral"
                onClick={() => setOpen(false)}
            >
                Cancel
            </Button>
            </Box>
        </ModalDialog>
        </Modal>

        {/* Header Component */}
        <Sheet
        variant="solid"
        color="main"
        invertedColors={true}
        sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            p: 2,
            minWidth: 'min-content',
            ...({
            background: (theme) =>
                `linear-gradient(to top, ${theme.vars.palette["main"][600]}, ${theme.vars.palette["main"][500]})`,
            }),
        }}
        >
        <Box sx={{ flex: 1, display: 'flex', gap: 1, px: 2 }}>
            <Button variant='soft' onClick={() => navigate("/")}>Grama App</Button>
        </Box>
      
      <Box sx={{ display: 'flex', flexShrink: 0, gap: 2 }}>
        {
            state.isAuthenticated && userRole === "CITIZEN" && (<Button variant='filled' onClick={() => navigate("/citizen")}>
                Dashboard
            </Button>
            )
        }
        {
            state.isAuthenticated && userRole === "GRAMA-SEWAKA" && (<Button variant='filled' onClick={() => navigate("/grama-sewaka")}>
                Dashboard
            </Button>
            )
        }
        {
            state.isAuthenticated && (
                <Dropdown>
                    <MenuButton
                        variant="soft"
                        sx={{
                            '--Button-radius': '1.5rem',
                        }}
                        endDecorator={<KeyboardArrowDownIcon />}
                    >
                     {state.username.length > 10 ? state.username.substring(0, 10) + " ..." : state.username}
                    </MenuButton>
                    <Menu
                    variant="plain"
                    placement="bottom-end"
                    disablePortal
                    size="sm"
                    sx={{
                        '--ListItemDecorator-size': '24px',
                        '--ListItem-minHeight': '40px',
                        '--ListDivider-gap': '4px',
                        minWidth: 200,
                    }}
                    >
                        <MenuItem>
                            <ListItemDecorator>
                            <FaceIcon />
                            </ListItemDecorator>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={() => signOut()}>
                            <ListItemDecorator>
                            <OutputIcon/>
                            </ListItemDecorator>
                            Sign Out
                        </MenuItem>
                    </Menu>
                </Dropdown>
            )
        }
        {
            !state.isAuthenticated && <Button variant='soft' endDecorator={<ArrowForwardIosIcon fontSize='sm'/>} onClick={() => signIn()}>Sign In</Button>
        }
        
      </Box>
    </Sheet>
    </>);
}

export default Header;