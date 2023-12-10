import { useAuthContext } from "@asgardeo/auth-react";
import { Box, Button, Modal, ModalDialog, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";

function ErrorHandler({ errorCode, showError }){
    /*
    * Valid error codes 
    *   401 - Unauthroized
    *   Else - Internal server error
    */

    const { signOut } = useAuthContext();
    const navigate = useNavigate();

    if(errorCode === 401){
        return (<Modal open={showError}>
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
                    Oops, Unauthorized!
                </Typography>
                <Typography id="nested-modal-description" textColor="text.tertiary">
                Looks like your session expired. Please sign out and sign in again.
                </Typography>
                <Box
                sx={{
                    mt: 1,
                    display: 'flex',
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row-reverse' },
                }}
                >
                <Button variant="plain" color="main" onClick={() => navigate("/")}>
                    Go to Home
                </Button>
                <Button variant="solid" color="main" onClick={() => signOut()}>
                    Sign out
                </Button>
                </Box>
            </ModalDialog>
        </Modal>);
    } else {
        return (<Modal open={showError}>
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
        </Modal>);
    }
}

export default ErrorHandler;