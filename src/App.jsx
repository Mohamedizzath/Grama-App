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
  signInRedirectURL: window.config.auth.signInRedirectURL,
  signOutRedirectURL: window.config.auth.signOutRedirectURL,
  clientID: window.config.auth.clientID,
  baseUrl: window.config.auth.baseUrl,
  scope: [ "openid","profile", "app_roles", "email","phone"],
  "storage": "sessionStorage"
};

export default App
