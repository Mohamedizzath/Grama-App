import { Typography } from "@mui/material";
import { useAuthContext } from "@asgardeo/auth-react";

function Index(){
    const { state, signIn, signOut } = useAuthContext();

    return (
        <div className="App">
          {
            state.isAuthenticated
              ? (
                <div>
                  <ul>
                    <li>{state.username}</li>
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