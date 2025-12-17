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
import CitizenProfile from "../pages/Dashboard/CitizenProfile";
import CitizenDashboardHome from "../pages/Dashboard/CitizenDashboardHome";
import IssueDetails from "../pages/Dashboard/IssueDetails";
import AdminDashboard from "../pages/Dashboard/Admin/AdminDashboard";
import AdminDashboardHome from "../pages/Dashboard/Admin/AdminDashboardHome";
import AdminAllIssues from "../pages/Dashboard/Admin/AdminAllIssues";
import AdminManageUsers from "../pages/Dashboard/Admin/AdminManageUsers";
import AdminManageStaff from "../pages/Dashboard/Admin/AdminManageStaff";
import AdminPayments from "../pages/Dashboard/Admin/AdminPayments";
import AdminProfile from "../pages/Dashboard/Admin/AdminProfile";
import StaffDashboard from "../pages/Dashboard/Staff/StaffDashboard";
import StaffDashboardHome from "../pages/Dashboard/Staff/StaffDashboardHome";
import StaffAssignedIssues from "../pages/Dashboard/Staff/StaffAssignedIssues";
import StaffProfile from "../pages/Dashboard/Staff/StaffProfile";

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
      // --- DASHBOARD ROUTES (Nested Structure) ---
      {
        path: "dashboard",
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
          // 🎯 CITIZEN DASHBOARD (PARENT ROUTE)
          {
            // The main layout route /dashboard/citizen
            path: "citizen",
            element: (
              <RoleRoute allowedRoles={['citizen']}>
                <CitizenDashboard />
              </RoleRoute>
            ),
            children: [
              // 1. Citizen Home (Stats Overview) - Index Route
              {
                path: '',
                index: true, // Maps to the base path /dashboard/citizen
                element: <CitizenDashboardHome />,
              },

              // 2. Report New Issue
              {
                path: "report-issue",
                element: <ReportIssue />,
              },

              // 3. My Reported Issues (List, Filter, Edit, Delete)
              {
                path: "my-issues",
                element: <MyIssues />,
              },

              // 4. Profile & Subscription
              {
                path: "profile",
                element: <CitizenProfile />,
              },
              {
                path: 'issue-details/:id', 
                element: <IssueDetails />,
              },


            ],
          },
          // ADMIN DASHBOARD (PARENT ROUTE)
          {
            path: "admin",
            element: (
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            ),
            children: [
              {
                path: '',
                index: true,
                element: <AdminDashboardHome />,
              },
              {
                path: "all-issues",
                element: <AdminAllIssues />,
              },
              {
                path: "manage-users",
                element: <AdminManageUsers />,
              },
              {
                path: "manage-staff",
                element: <AdminManageStaff />,
              },
              {
                path: "payments",
                element: <AdminPayments />,
              },
              {
                path: "profile",
                element: <AdminProfile />,
              },
            ],
          },
          // STAFF DASHBOARD (PARENT ROUTE)
          {
            path: "staff",
            element: (
              <RoleRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </RoleRoute>
            ),
            children: [
              {
                path: '',
                index: true,
                element: <StaffDashboardHome />,
              },
              {
                path: "assigned-issues",
                element: <StaffAssignedIssues />,
              },
              {
                path: "profile",
                element: <StaffProfile />,
              },
            ],
          },
        ]
      }

    ],
  },
]);