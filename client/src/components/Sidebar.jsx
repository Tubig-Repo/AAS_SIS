import { jwtDecode } from "jwt-decode";
import { NavLink } from "react-router";
import { useState, useRef, useEffect } from "react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Add your logout logic here (redirect, clear state, etc.)
    window.location.href = "/login";
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="flex-shrink-0 p-3 bg-light position-relative"
      style={{
        width: isCollapsed ? "80px" : "280px",
        height: "100vh",
        transition: "width 0.3s ease",
      }}
    >
      {/* Toggle Button */}
      <button
        className="btn btn-outline-secondary position-absolute"
        style={{
          top: "10px",
          right: isCollapsed ? "10px" : "15px",
          zIndex: 1000,
          width: "30px",
          height: "30px",
          padding: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={toggleSidebar}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <i
          className={`bi ${
            isCollapsed ? "bi-chevron-right" : "bi-chevron-left"
          }`}
        ></i>
      </button>

      {/* Logo/Title */}
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none"
        style={{ marginTop: "30px" }}
      >
        <span className={`fs-4 ${isCollapsed ? "d-none" : ""}`}>Sidebar</span>
        {isCollapsed && <i className="bi bi-grid-3x3-gap-fill fs-4"></i>}
      </a>
      <hr />

      {/* Navigation */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "link-dark")
            }
            title="Dashboard"
          >
            <i className="bi bi-speedometer2 me-2"></i>
            <span className={isCollapsed ? "d-none" : ""}>Dashboard</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/dashboard/students"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "link-dark")
            }
            title="Students"
          >
            <i className="bi bi-person me-2"></i>
            <span className={isCollapsed ? "d-none" : ""}>Students</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/fees"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "link-dark")
            }
            title="Fees and Management"
          >
            <i className="bi bi-piggy-bank me-2"></i>
            <span className={isCollapsed ? "d-none" : ""}>
              Fees and Management
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/bill"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "link-dark")
            }
            title="Billing and Statements"
          >
            <i className="bi bi-receipt me-2"></i>
            <span className={isCollapsed ? "d-none" : ""}>
              Billing and Statements
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/payments"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "link-dark")
            }
            title="Payments"
          >
            <i className="bi bi-cash me-2"></i>
            <span className={isCollapsed ? "d-none" : ""}>Payments</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/reports"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "link-dark")
            }
            title="Reports"
          >
            <i className="bi bi-clipboard-check me-2"></i>
            <span className={isCollapsed ? "d-none" : ""}>Reports</span>
          </NavLink>
        </li>
      </ul>
      <hr />

      {/* User Menu */}
      <div className="position-relative" ref={userMenuRef}>
        <button
          className="btn d-flex align-items-center text-decoration-none w-100 p-2 border-0 bg-transparent"
          onClick={toggleUserMenu}
          style={{ borderRadius: "8px" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          <img
            src="https://github.com/mdo.png"
            alt="User Avatar"
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          <div
            className={`d-flex align-items-center justify-content-between flex-grow-1 ${
              isCollapsed ? "d-none" : ""
            }`}
          >
            <strong>Admin</strong>{" "}
            {/* This should be changed base on the user logged in */}
            <i
              className={`bi ${
                isUserMenuOpen ? "bi-chevron-up" : "bi-chevron-down"
              }`}
            ></i>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isUserMenuOpen && (
          <div
            className="position-absolute bottom-100 mb-2 bg-white border rounded shadow-lg"
            style={{
              width: isCollapsed ? "200px" : "100%",
              left: isCollapsed ? "calc(100% + 10px)" : "0",
              zIndex: 1050,
            }}
          >
            <div className="p-2">
              <div className="dropdown-header px-2 py-1">
                <small className="text-muted">Signed in as</small>
                <div className="fw-bold">Admin User</div>
              </div>
              <hr className="dropdown-divider my-2" />

              <button
                className="dropdown-item btn btn-link text-start p-2 w-100 border-0 bg-transparent d-flex align-items-center"
                onClick={() => {
                  setIsUserMenuOpen(false);
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <i className="bi bi-person-circle me-2"></i>
                Profile
              </button>

              <button
                className="dropdown-item btn btn-link text-start p-2 w-100 border-0 bg-transparent d-flex align-items-center"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  // Add your settings navigation logic here
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <i className="bi bi-gear me-2"></i>
                Settings
              </button>

              <button
                className="dropdown-item btn btn-link text-start p-2 w-100 border-0 bg-transparent d-flex align-items-center"
                onClick={() => {
                  setIsUserMenuOpen(false);
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <i className="bi bi-question-circle me-2"></i>
                Help & Support
              </button>

              <hr className="dropdown-divider my-2" />

              <button
                className="dropdown-item btn btn-link text-start p-2 w-100 border-0 bg-transparent d-flex align-items-center text-danger"
                onClick={handleLogout}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
