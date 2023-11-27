import { createBrowserRouter } from "react-router-dom";
import Index from "../pages";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import CitizenIndex from "../pages/citizen";
import GramaSewakaIndex from "../pages/gramaSewaka";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Index />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/citizen",
        element: <CitizenIndex />
    },
    {
        path: "/grama-sewaka",
        element: <GramaSewakaIndex />
    }
]);

export default router;