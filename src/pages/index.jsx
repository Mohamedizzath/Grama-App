import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuthContext } from "@asgardeo/auth-react";

function Index() {
    const { state, signOut, getAccessToken, signIn } = useAuthContext();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // Check whether user is authenticated
            if(!state.isAuthenticated){
                return;
            }

            try {
                const response = await fetch('https://api.asgardeo.io/t/wso2khadijah/oauth2/userinfo', {
                    headers: {
                        Authorization: `Bearer ${await getAccessToken()}`
                    }
                });

                if (response.ok) {
                    const json = await response.json();
                    setUserInfo(json);
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
        console.log("user info", userInfo);
    }, [getAccessToken]);

    return (
        <>
        <Header secured={false} />
        <div className="App">
            {state.isAuthenticated ? (
                <div>
                    <ul>
                        <li>{state.username}</li>
                        <li>{state.displayName}</li>
                        <li>{state.sub}</li>

                        {userInfo && (
                            <>
                                <li>birthdate: {userInfo.birthdate}</li>
                                <li>role: {userInfo.application_roles}</li>
                            </>
                        )}
                    </ul>

                    <button onClick={() => signOut()}>Logout</button>
                </div>
            ) : (
                <button onClick={() => signIn()}>Let's Get Started</button>
            )}
        </div>
    </>
    );
}

export default Index;
