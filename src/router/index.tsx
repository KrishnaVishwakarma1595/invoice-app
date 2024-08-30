import { createBrowserRouter } from "react-router-dom";
import Invoices from "../components/invoices";
import Invoice from "../views/invoice";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Invoices />
    },
    {
        path: "invoice/:invoiceId",
        element: <Invoice />
    }    
]);