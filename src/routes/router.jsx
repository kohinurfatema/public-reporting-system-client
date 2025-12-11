// src/routes/router.jsx

import { createBrowserRouter } from "react-router"; // Use 'react-router-dom' not just 'react-router'
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import AllIssues from "../pages/AllIssues"; // Assuming this page exists
import Login from "../pages/Login"; // Assuming this page exists
import Register from "../pages/Register"; // Assuming this page exists
import NotFound from "../pages/NotFound"; // Need a 404 page
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import ReportIssue from "../pages/Dashboard/ReportIssue";
import RoleRoute from "./RoleRoute";
import CitizenDashboard from "../pages/Dashboard/CitizenDashboard";
import MyIssues from "../pages/Dashboard/MyIssues";

// NOTE: Please ensure the component files (e.g., AllIssues, Login, etc.) 
// are created in your 'src/pages' directory, even if they are placeholders for now.

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // RootLayout acts as the container for Navbar and Footer
    errorElement: <NotFound />, // Shows custom 404 page for errors/invalid URLs
    children: [
      {
        index: true, // This is the default child route for "/"
        element: <Home />, // Home page, which includes the Banner
      },
      {
        path: "all-issues",
        element: <AllIssues />, // Page to display all issues
      },
     // ✅ Meaningful Public Routes for Extra Pages
      {
        path: "reports",
        element: (
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold">Reports Page</h1>
                <p className="mt-4">Placeholder for the main Reports and Statistics page.</p>
            </div>
        ),
      },
      {
        path: "resources",
        element: (
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold">Resources Page</h1>
                <p className="mt-4">Placeholder for FAQs, contact info, or system documentation.</p>
            </div>
        ),
      },
      // Authentication Routes
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      // You will add the Dashboard route here later:
      
      {
        path: "dashboard",
        element:  <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
      // Citizen Dashboard Routes
      {
        path: "citizen",
        element: (
          <RoleRoute allowedRoles={['citizen']}>
            <CitizenDashboard />
          </RoleRoute>
        ),
      },
      {
        path: "citizen/my-issues",
        element: (
          <RoleRoute allowedRoles={['citizen']}>
            <MyIssues />
          </RoleRoute>
        ),
      },
       {
        path: "citizen/report-issue",
        element: (
          <RoleRoute allowedRoles={['citizen']}>
            <ReportIssue />
          </RoleRoute>
        ),
      }
       ]
      }
      
    ],
  },
]);