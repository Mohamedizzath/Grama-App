import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider, SecureRoute } from "@asgardeo/auth-react";
import router from './config/router';
import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import { CssVarsProvider, ThemeProvider } from '@mui/joy';
import theme from './theme';

function App() {

  return (
    <>
      <AuthProvider config={ config }>
        <CssVarsProvider theme={theme}>
          <RouterProvider router={router} />
        </CssVarsProvider>
      </AuthProvider>
    </>
  )
}

const config = {
  //signInRedirectURL: `https://58ad342e-1774-4eda-93b8-900296960674.e1-us-east-azure.choreoapps.dev`, // Change when deploying
  //signOutRedirectURL: `https://58ad342e-1774-4eda-93b8-900296960674.e1-us-east-azure.choreoapps.dev`,
  signInRedirectURL:'http://localhost:5173/',
  signOutRedirectURL:'http://localhost:5173/',
  clientID: `fzo2NWtoZMhrklIDf95yz9TjkqQa`,
  baseUrl: `https://api.asgardeo.io/t/wso2khadijah`,
  scope: [ "openid","profile", "app_roles", "email","phone"],
  "storage": "sessionStorage"
};

export default App
