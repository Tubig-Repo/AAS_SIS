import { useState, useEffect } from "react";
import AddStudentModal from "../components/AddStudentModal";

export default function Student() {
  const [selected, setSelected] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Save Student Data Request to Server
  const handleSaveStudent = async (studentData) => {
    try {
      const formData = new FormData();

      // Append all fields manually
      Object.entries(studentData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok || res.status === 200 || res.status === 201) {
        alert("Student saved successfully!");
        getStudentData();
        return true; // This will close the modal
      } else {
        alert(result.message || "Failed to save student");
        return false;
      }
    } catch (err) {
      console.error("Failed to POST student data:", err);
      alert("Something went wrong while saving."); // optional
      return false;
    }
  };

  const toggleSelect = (index) => {
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      setSelected([...selected, index]);
    }
  };
  // Delete an item from the data
  const handleDelete = () => {};

  const handleDate = (date) => {
    const newDate = new Date(date);

    return newDate.toLocaleDateString("en-CA");
  };
  // Fetch Student Data from the database
  const getStudentData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/students", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setStudents(data || []);
    } catch (err) {
      console.log("Fetch Error");
    }
  };

  useEffect(() => {
    getStudentData();
  }, []);

  return (
    <div className="mt-5">
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            {/* Search Input */}
            <div className="col-md-6">
              <label htmlFor="searchInput" className="form-label fw-bold">
                Search
              </label>
              <input
                type="text"
                id="searchInput"
                className="form-control"
                placeholder="Search by name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter by Level */}
            <div className="col-md-3">
              <label htmlFor="levelFilter" className="form-label fw-bold">
                Filter by Level
              </label>
              <select
                id="levelFilter"
                className="form-select"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="Kindergarten">Kindergarten</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                {/* Add more levels as needed */}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="col-md-3">
              <label htmlFor="statusFilter" className="form-label fw-bold">
                Filter by Status
              </label>
              <select
                id="statusFilter"
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0">
            Manage <strong>Students</strong>
          </h5>
          <div>
            <button className="btn btn-danger me-2" onClick={handleDelete}>
              <i className="bi bi-dash-circle me-1"></i> Delete
            </button>
            {/* Add Student Functionality */}
            <button
              className="btn btn-success"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus-circle me-1"></i> Add New Student
            </button>

            <AddStudentModal
              show={showModal}
              onClose={() => setShowModal(false)}
              onSave={handleSaveStudent}
            />
          </div>
        </div>

        <div className="card-body p-0 table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>
                  <input type="checkbox" disabled />
                </th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Birthdate</th>
                <th>Gender</th>
                <th>Level</th>
                <th>Section</th>
                <th>Guardian</th>
                <th>Guardian Contact</th>
                <th>Guardian Email</th>
                <th>Address</th>
                <th>Status</th>
                <th>Date Enrolled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i}>
                  <td>
                    <input
                      type="checkbox"
                      style={{ width: "100%", height: "25px" }}
                      checked={selected.includes(i)}
                      onChange={() => toggleSelect(i)}
                    />
                  </td>
                  <td>{s.student_id}</td>
                  <td>{`${s.first_name} ${s.middle_name || ""} ${
                    s.last_name
                  }`}</td>
                  <td>{handleDate(s.birthdate)}</td>
                  <td>{s.gender}</td>
                  <td>{s.level}</td>
                  <td>{s.section}</td>
                  <td>{s.guardian_name}</td>
                  <td>{s.guardian_contact_number}</td>
                  <td>{s.guardian_email}</td>
                  <td>{s.address}</td>
                  <td>
                    <span
                      className={`badge ${
                        s.status === "active" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td>{handleDate(s.date_enrolled)}</td>
                  <td>
                    <button className="btn btn-sm text-warning">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn btn-sm text-danger">
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="13" className="text-center py-3 text-muted">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card-footer d-flex justify-content-between align-items-center">
          <small>Showing {students.length} students</small>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item">
                <a className="page-link" href="#">
                  Previous
                </a>
              </li>
              <li className="page-item active">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
