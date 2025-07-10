import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="d-flex">
      {/* Sidebar */}
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
            <a href="#" className="nav-link active" aria-current="page">
              <i class="bi bi-speedometer2 me-2"></i>
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="nav-link link-dark">
              <i class="bi bi-person me-2"></i>
              Students
            </a>
          </li>
          <li>
            <a href="#" className="nav-link link-dark">
              <i class="bi bi-piggy-bank me-2"></i>
              Fees Management
            </a>
          </li>
          <li>
            <a href="#" className="nav-link link-dark">
              <i class="bi bi-receipt me-2"></i>
              Billing and Statements
            </a>
          </li>
          <li>
            <a href="#" className="nav-link link-dark">
              <i class="bi bi-cash me-2"></i>
              Payments
            </a>
          </li>
          <li>
            <a href="#" className="nav-link link-dark">
              <i class="bi bi-clipboard-check me-2"></i>
              Reports
            </a>
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

      {/* Main Content */}
      <div className="p-4">
        <h1>Main content area</h1>
        <p>
          This is where your main content goes alongside the sidebar navigation.
        </p>
      </div>
    </div>
  );
}
