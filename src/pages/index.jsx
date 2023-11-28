import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuthContext } from "@asgardeo/auth-react";
import RefreshScreen from "./refresh";

function Index() {
    const { state, signIn } = useAuthContext();
    //const [userInfo, setUserInfo] = useState(null);

    return (
        <>
        <Header secured={false} />
        <div className="App">
            {state.isAuthenticated ? (
                <RefreshScreen />
            ) : (
                <button onClick={() => signIn()}>Let's Get Started</button>
            )}
        </div>
    </>
    );
}

export default Index;
