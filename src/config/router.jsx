import { createBrowserRouter } from "react-router-dom";
import Index from "../pages";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";

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
        path: "/dashboard",
        element: <Dashboard />
    }
]);

export default router;