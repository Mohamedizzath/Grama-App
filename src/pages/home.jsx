import React from "react";
import Header from "../components/Header";

function Home (){
    return(
        <div>
            <Header secured={false} />
            <h1>home page for all</h1>
        </div>

    );
}

export default Home;