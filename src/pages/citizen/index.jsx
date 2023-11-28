import Header from "../../components/Header";

function CitizenIndex(){
    return <>
            <Header secured={true} role="CITIZEN" />
            <h1>Citizen Dashboard!</h1>
        </>;
}

export default CitizenIndex;