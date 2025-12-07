// src/routes/router.jsx

import { createBrowserRouter } from "react-router"; // Use 'react-router-dom' not just 'react-router'
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import AllIssues from "../pages/AllIssues"; // Assuming this page exists
import Login from "../pages/Login"; // Assuming this page exists
import Register from "../pages/Register"; // Assuming this page exists
import NotFound from "../pages/NotFound"; // Need a 404 page

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
      // Placeholder routes for your two extra pages
      {
        path: "reports",
      
      },
      {
        path: "extra-page-2",
        element: <div>Extra Page 2 Content</div>,
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
      /*
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          // Nested dashboard routes (admin, staff, citizen)
        ]
      }
      */
    ],
  },
]);