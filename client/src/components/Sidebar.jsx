import { jwtDecode } from "jwt-decode";
import { NavLink } from "react-router";
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
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none"
      >
        <span className="fs-4">Sidebar</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item ">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "link-dark")
            }
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/dashboard/students"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "link-dark")
            }
          >
            <i className="bi bi-person me-2"></i>
            Students
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/fees"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "link-dark")
            }
          >
            <i class="bi bi-piggy-bank me-2"></i>
            Fees and Management
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/bill"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "link-dark")
            }
          >
            <i class="bi bi-receipt me-2"></i>
            Billing and Statements
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/payments"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "link-dark")
            }
          >
            <i class="bi bi-cash me-2"></i>
            Payments
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/reports"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "link-dark")
            }
          >
            <i class="bi bi-clipboard-check me-2"></i>
            Reports
          </NavLink>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <a
          href="#"
          className="d-flex align-items-center text-decoration-none dropdown-toggle"
          id="dropdownUser1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://github.com/mdo.png"
            alt=""
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          <strong>Admin</strong>
        </a>
        <ul
          className="dropdown-menu text-small shadow"
          aria-labelledby="dropdownUser1"
        >
          <li>
            <a className="dropdown-item" href="#">
              New project...
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Settings
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Profile
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
