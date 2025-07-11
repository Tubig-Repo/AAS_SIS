import { Link } from "react-router";
import { jwtDecode } from "jwt-decode";

export default function Sidebar() {
  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  return (
    <div
      className="flex-shrink-0 p-3 bg-light"
      style={{ width: "280px", height: "100vh" }}
    >
      <span className="fs-4 mb-4 d-block">Sidebar</span>
      <ul className="nav nav-pills flex-column mb-auto">
        <li>
          <Link to="/dashboard" className="nav-link link-dark">
            Dashboard
          </Link>
        </li>

        {/* Registrar-only Link */}
        {role === "registrar" && (
          <li>
            <Link to="/students" className="nav-link link-dark">
              Students
            </Link>
          </li>
        )}

        {/* Admin-only Links */}
        {role === "admin" && (
          <>
            <li>
              <Link to="/fees" className="nav-link link-dark">
                Fees Management
              </Link>
            </li>
            <li>
              <Link to="/payments" className="nav-link link-dark">
                Payments
              </Link>
            </li>
          </>
        )}

        {/* Shared Links */}
        <li>
          <Link to="/reports" className="nav-link link-dark">
            Reports
          </Link>
        </li>
      </ul>
    </div>
  );
}
