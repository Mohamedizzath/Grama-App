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
import Profile from './Profile';

function Header({ secured, role }){
    // Authentication logic
    const { state, signOut, signIn, getAccessToken } = useAuthContext();
    const [ userRole, setUserRole ] = useState(undefined);
    const [ userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Handling Error messages
    // Error obj documentation - title, body, mainBtn: { mainBtnText, mainBtnAction }, secondBtn:{ secondBtnText, secondBtnAction} 
    const defaultErrObj = {
        title: null,
        body: null,
        mainBtn: { mainBtnText: null, mainBtnAction: null },
        secondBtn: { secondBtnText: null, secondBtnAction: null }
    };
    const [errorObj, setErrorObj] = useState(defaultErrObj);
    const [showError, setShowError] = useState(true);

    // Adding router navigation
    const navigate = useNavigate();

    async function handleAuthorization(secured, role){
        // Rendering page is secured page
        if(state.isAuthenticated === true && secured === true && role){
            // Entered page is properly authenticated
            // Next step is to check the role

            const sessionRole = sessionStorage.getItem('User-Role');

            if(sessionRole === role){
                setUserRole(sessionRole);
            }

            try {
                const response = await fetch('https://api.asgardeo.io/t/interns/oauth2/userinfo', {
                    headers: {
                        Authorization: `Bearer ${await getAccessToken()}`
                    }
                });
                
                if (response.ok) {
                    const json = await response.json();
                    setUserDetails(json); // Setting the userDetails

                    const fetchedRole = json.application_roles;


                    if(!fetchedRole){
                        setUserRole("CITIZEN");
                        sessionStorage.setItem('User-Role', 'CITIZEN');
                    } else if(fetchedRole === "gramaSewaka") {
                        setUserRole("GRAMA-SEWAKA");
                        sessionStorage.setItem('User-Role', 'GRAMA-SEWAKA');
                    }

                    // setIsLoading(false);
                } else if(response.status === 401) {
                    const errObj = {
                        title: "Oops, Unauthorized!",
                        body: "Looks like your session expired. Please sign out and sign in again.",
                        mainBtn: { mainBtnText: "Sign out", mainBtnAction: () => signOut() },
                        secondBtn: { secondBtnText: "Go to Home", secondBtnAction: () => navigate("/") }
                    }
                    setErrorObj(errObj);
                    setShowError(true);
                } else {
                    const errObj = {
                        title: "Oops, Internal server error!",
                        body: "Looks like internal server having some issue. Please try again later.",
                        mainBtn: { mainBtnText: "Go to Home", mainBtnAction: () => navigate("/") },
                        secondBtn: { secondBtnText: "Cancel", secondBtnAction: () => showError(false) }
                    }
                    setErrorObj(errObj);
                    setShowError(true); 
                }
            } catch (error) {
                const errObj = {
                    title: "Oops, Internal server error!",
                    body: "Looks like internal server having some issue. Please try again later.",
                    mainBtn: { mainBtnText: "Go to Home", mainBtnAction: () => navigate("/") },
                    secondBtn: { secondBtnText: "Cancel", secondBtnAction: () => showError(false) }
                }
                setErrorObj(errObj);
                setShowError(true); 
            }
        } else if(state.isAuthenticated === true && secured === true && !role){
            // For the profile page
            return true;
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

    useEffect(() => {
        validateUserRole(isLoading, secured, role, userRole);
    }, [userRole]);

    function validateUserRole(isLoading, secured, pageRole, currentRole){
        if(secured && !isLoading && pageRole !== currentRole){
            // Invalid permission - redirect to logout 
            const errObj = {
                title: "Oops, Authorization failed!",
                body: "Looks like you don't have proper access to view this page. Please try to use different account.",
                mainBtn: { mainBtnText: "Sign out", mainBtnAction: () => signOut() },
                secondBtn: { secondBtnText: "Go to Home", secondBtnAction: () => navigate("/") }
            }
            setErrorObj(errObj);
            setShowError(true);
        } else {
            setShowError(false);
            return true;
        }
    }

    // Handling profile modal state
    const [profileOpen, setProfileOpen] = useState(false);

    return (<>
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
             { errorObj.title ? errorObj.title : "" }
            </Typography>
            <Typography id="nested-modal-description" textColor="text.tertiary">
            { errorObj.body ? errorObj.body : "" }
            </Typography>
            <Box
            sx={{
                mt: 1,
                display: 'flex',
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row-reverse' },
            }}
            >
            <Button variant="solid" color="main" onClick={errorObj.mainBtn.mainBtnAction}>
                { errorObj.mainBtn.mainBtnText }
            </Button>
            <Button
                variant="plain"
                color="main"
                onClick={errorObj.secondBtn.secondBtnAction}
            >
                {errorObj.secondBtn.secondBtnText}
            </Button>
            </Box>
        </ModalDialog>
        </Modal>

        {/* Profile Component */}
        {userDetails && (
            <Profile open={profileOpen} setOpen={setProfileOpen} userDetails={userDetails} />
        )} 

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
                     {state.displayName.length > 10 ? state.displayName.substring(0, 10) + " ..." : state.displayName}
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
                        <MenuItem onClick={() => setProfileOpen(true)}>
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