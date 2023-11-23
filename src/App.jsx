import { useState } from 'react'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Typography } from '@mui/material';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Typography variant="h3" component="h3">Hello World</Typography>
    </>
  )
}

export default App
