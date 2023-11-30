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
  signInRedirectURL: `${import.meta.env.VITE_ASGARDEO_SIGNIN_URL}`,
  signOutRedirectURL: `${import.meta.env.VITE_ASGARDEO_SIGNOUT_URL}`,
  clientID: `${import.meta.env.VITE_ASGARDEO_CLIENT_ID}`,
  baseUrl: `${import.meta.env.VITE_ASGARDEO_BASE_URL}`,
  scope: [ "openid","profile", "app_roles", "email","phone"],
  "storage": "sessionStorage"
};

export default App
