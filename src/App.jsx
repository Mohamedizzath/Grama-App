import { useState } from 'react'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Typography } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from "@asgardeo/auth-react";
import config from './config/asgardeo-config';
import router from './config/router';


function App() {

  return (
    <>
      <AuthProvider config={ config }>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
