import { useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap-icons/font/bootstrap-icons.css"; // For Bootstrap Icons
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/aas_logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (res.ok && data.role === "admin") {
        navigate("/dashboard");
      } else {
        alert("Access denied: not an admin");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="container">
      <div className="row vh-100 justify-content-center align-items-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0">
            <div className="row g-0">
              {/* Login Form */}
              <div className="col-md-6 p-5">
                <h3 className="mb-4">Login Now</h3>
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username<span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person-fill"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password<span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check"></div>
                    <a href="#" className="text-decoration-none">
                      Forgot Password?
                    </a>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </form>
              </div>

              {/* Logo / Welcome Section */}
              <div
                className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white"
                style={{ backgroundColor: "#ffff" }}
              >
                <div
                  className="container text-center"
                  style={{
                    width: "220px",
                    height: "190px",
                  }}
                >
                  <img
                    src={logo}
                    alt=""
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <h3
                  className="fw-bold text-center mt-5"
                  style={{ color: "black" }}
                >
                  AAS Student Information System
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
