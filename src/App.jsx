import { useState } from 'react'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Typography } from '@mui/material';
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
  signInRedirectURL: `https://f0f85940-267a-4c31-b011-c56edd21bdea.e1-us-east-azure.choreoapps.dev`,
  signOutRedirectURL: `https://f0f85940-267a-4c31-b011-c56edd21bdea.e1-us-east-azure.choreoapps.dev`,
  clientID: `fzo2NWtoZMhrklIDf95yz9TjkqQa`,
  baseUrl: `https://api.asgardeo.io/t/wso2khadijah`,
  scope: [ "openid","profile", "app_roles", "email","phone"],
  "storage": "sessionStorage"
};

export default App
