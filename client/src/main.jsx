import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import FeesManagement from "./pages/FeesManagement.jsx";
import BillandStatement from "./pages/BillandStatements.jsx";
import Payments from "./pages/Payments.jsx";
import Reports from "./pages/Reports.jsx";
import Layout from "./components/Layout.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute requiredRole={["admin", "registrar"]}>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "students",
            element: (
              <ProtectedRoute requiredRole={["admin", "registrar"]}>
                <Students />
              </ProtectedRoute>
            ),
          },
          {
            path: "fees",
            element: (
              <ProtectedRoute requiredRole={["admin"]}>
                <FeesManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: "bill",
            element: (
              <ProtectedRoute requiredRole={["admin"]}>
                <BillandStatement />
              </ProtectedRoute>
            ),
          },
          {
            path: "payments",
            element: (
              <ProtectedRoute requiredRole={["admin"]}>
                <Payments />
              </ProtectedRoute>
            ),
          },
          {
            path: "reports",
            element: (
              <ProtectedRoute requiredRole={["admin"]}>
                <Reports />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
