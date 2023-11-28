import { createBrowserRouter } from "react-router-dom";
import Index from "../pages";
import CitizenIndex from "../pages/citizen";
import GramaSewakaIndex from "../pages/gramaSewaka";
import RefreshScreen from "../pages/refresh";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Index />
    },
    {
        path: "/refresh",
        element: <RefreshScreen />
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