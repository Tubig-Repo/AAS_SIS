import { useState, useEffect } from "react";
import AddStudentModal from "../components/AddStudentModal";
const mockData = [
  {
    name: "Thomas Hardy",
    email: "thomashardy@mail.com",
    address: "89 Chiaroscuro Rd, Portland, USA",
    phone: "(171) 555-2222",
  },
  {
    name: "Dominique Perrier",
    email: "dominiqueperrier@mail.com",
    address: "Obere Str. 57, Berlin, Germany",
    phone: "(313) 555-5735",
  },
  {
    name: "Maria Anders",
    email: "mariaanders@mail.com",
    address: "25, rue Lauriston, Paris, France",
    phone: "(503) 555-9931",
  },
  {
    name: "Fran Wilson",
    email: "franwilson@mail.com",
    address: "C/ Araquil, 67, Madrid, Spain",
    phone: "(204) 619-5731",
  },
  {
    name: "Martin Blank",
    email: "martinblank@mail.com",
    address: "Via Monte Bianco 34, Turin, Italy",
    phone: "(480) 631-2097",
  },
];

export default function Student() {
  const [employees, setEmployees] = useState(mockData);
  const [selected, setSelected] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleSaveStudent = (studentData) => {
    console.log('Saving student:', studentData);
    // Send to backend with fetch/axios here
  };

  const toggleSelect = (index) => {
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      setSelected([...selected, index]);
    }
  };

  const handleDelete = () => {
    const remaining = employees.filter((_, i) => !selected.includes(i));
    setEmployees(remaining);
    setSelected([]);
  };

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
                <th>Contact</th>
                <th>Address</th>
                <th>Status</th>
                <th>Enrolled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i}>
                  <td>
                    <input
                      type="checkbox"
                       style={{width: "100%", height: "25px"}} 
                      checked={selected.includes(i)}
                      onChange={() => toggleSelect(i)}
                    />
                  </td>
                  <td>{s.student_id}</td>
                  <td>{`${s.first_name} ${s.middle_name || ""} ${
                    s.last_name
                  }`}</td>
                  <td>{s.birthdate}</td>
                  <td>{s.gender}</td>
                  <td>{s.level}</td>
                  <td>{s.section}</td>
                  <td>{s.guardian_name}</td>
                  <td>{s.guardian_contact_number}</td>
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
                  <td>{s.date_enrolled}</td>
                  <td>
                    <button className="btn btn-sm text-warning me-2">
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
