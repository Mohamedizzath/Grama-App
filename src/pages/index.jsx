import { Typography } from "@mui/material";
import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect } from "react";

function Index(){
    const { state, signIn, signOut } = useAuthContext();
    
    useEffect(() => {
        console.log(state);
    }, [state]);


    return (
        <div className="App">
          {
            state.isAuthenticated
              ? (
                <div>
                  <ul>
                    <li>{state.username}</li>
                    <li>{state.displayName}</li>
                    <li>helo</li>
                  </ul>
    
                  <button onClick={() => signOut()}>Logout</button>
                </div>
              )
              : <button onClick={() => signIn()}>Login</button>
          }
        </div>
    );
}

export default Index;