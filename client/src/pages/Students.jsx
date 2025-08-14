import { useState, useEffect } from "react";
import AddStudentModal from "../components/AddStudentModal";

export default function Student() {
  const [selected, setSelected] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [editMode, setEditMode] = useState(false);

  // 🆕 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5); // You can make this configurable

  // 🆕 Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // Fetch Student Data from the database
  const getStudentData = async () => {
    setIsLoading(true);
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
      // 🗑️ REMOVED - totalStudents state not needed since we calculate from filteredStudents.length
    } catch (err) {
      console.log("Fetch Error");
    } finally {
      setIsLoading(false);
    }
  };

  // Save Student Data Request to Server
  const handleSaveStudent = async (studentData) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: studentData,
      });

      const result = await res.json();

      if (res.ok || res.status === 200 || res.status === 201) {
        alert("Student saved successfully!");
        getStudentData();
        return true;
      } else {
        alert(result.message || "Failed to save student");
        return false;
      }
    } catch (err) {
      console.error("Failed to POST student data:", err);
      alert("Something went wrong while saving.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStudent = async (formData) => {
    setIsUpdating(true);
    try {
      const studentId = formData.get("student_id");

      let res;
      try {
        res = await fetch(`http://localhost:5000/api/students/${studentId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });
      } catch (networkError) {
        console.error("Network error during fetch:", networkError);
        throw new Error("Fetch/network error");
      }

      let result;
      try {
        result = await res.json();
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        const text = await res.text();
        console.warn("Raw response text:", text);
        throw new Error("Invalid JSON from server");
      }

      if (res.ok) {
        alert("Student updated successfully!");
        getStudentData();
        return true;
      } else {
        alert(result.message || "Failed to update student");
        return false;
      }
    } catch (err) {
      console.error("Caught error in handleUpdateStudent:", err);
      alert("Something went wrong while updating.");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleSelect = (index) => {
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      setSelected([...selected, index]);
    }
  };

  const handleDeleteStudent = () => {};

  const handleDate = (date) => {
    return new Date(date).toLocaleDateString("en-CA");
  };

  const updateButton = (student_id) => {
    const student = students.find((s) => s.student_id === student_id);
    if (!student) return;

    setSelectedStudent(student);
    setEditMode(true);
    setShowModal(true);
  };

  useEffect(() => {
    getStudentData();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterLevel, filterStatus]);

  // Filter students based on search and filters
  const filteredStudents = students.filter((s) => {
    const fullName = `${s.first_name} ${s.middle_name || ""} ${s.last_name}`
      .toLowerCase()
      .trim();
    const studentId = s.student_id?.toLowerCase() || "";
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      fullName.includes(search) || studentId.includes(search);
    const matchesLevel = filterLevel ? s.level === filterLevel : true;
    const matchesStatus = filterStatus ? s.status === filterStatus : true;

    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelected([]); // Clear selections when changing pages
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

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
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
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
                <option value="graduated">Graduated</option>
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
            <button
              className="btn btn-danger me-2"
              onClick={handleDeleteStudent}
              disabled={selected.length === 0}
            >
              <i className="bi bi-dash-circle me-1"></i> Delete (
              {selected.length})
            </button>
            <button
              disabled={isSaving}
              className="btn btn-success"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus-circle me-1"></i>{" "}
              {isSaving ? "Saving..." : "Add New Student"}
            </button>

            <AddStudentModal
              show={showModal}
              mode={editMode ? "edit" : "add"}
              studentData={editMode ? selectedStudent : null}
              onClose={() => {
                setShowModal(false);
                setEditMode(false);
                setSelectedStudent(null);
              }}
              onSave={handleSaveStudent}
              onEdit={handleUpdateStudent}
            />
          </div>
        </div>

        <div className="card-body p-0 table-responsive">
          {isLoading ? (
            <div className="text-center p-4">
              <div className="spinner-border" role="status"></div>
              <div>Loading students...</div>
            </div>
          ) : (
            // Your existing table
            <table className="table table-striped table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Select all items on current page
                          setSelected(
                            currentStudents.map(
                              (_, index) => startIndex + index
                            )
                          );
                        } else {
                          setSelected([]);
                        }
                      }}
                      checked={
                        currentStudents.length > 0 &&
                        currentStudents.every((_, index) =>
                          selected.includes(startIndex + index)
                        )
                      }
                    />
                  </th>
                  <th>Student ID</th>
                  <th>LRN</th>
                  <th>Name</th>
                  <th>Birthdate</th>
                  <th>Gender</th>
                  <th>Level</th>
                  <th>Section</th>
                  <th>Guardian</th>
                  <th>Guardian Contact</th>
                  <th>Status</th>
                  <th>Payment Plan</th>
                  <th>Date Enrolled</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((s, i) => {
                  const actualIndex = startIndex + i;
                  return (
                    <tr key={actualIndex}>
                      <td>
                        <input
                          type="checkbox"
                          style={{ width: "100%", height: "25px" }}
                          checked={selected.includes(actualIndex)}
                          onChange={() => toggleSelect(actualIndex)}
                        />
                      </td>
                      <td>{s.student_id}</td>
                      <td>{s.LRN}</td>
                      <td>{`${s.first_name} ${s.middle_name || ""} ${
                        s.last_name
                      }`}</td>
                      <td>{handleDate(s.birthdate)}</td>
                      <td>{s.gender}</td>
                      <td>{s.level}</td>
                      <td>{s.section}</td>
                      <td>{s.guardian_name}</td>
                      <td>{s.guardian_contact_number}</td>
                      <td>
                        <span
                          style={{ fontSize: "15px" }}
                          className={`badge ${
                            s.status === "active"
                              ? "bg-success"
                              : s.status === "inactive"
                              ? "bg-secondary"
                              : s.status === "graduated"
                              ? "bg-warning text-dark"
                              : "bg-light"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "15px",
                            backgroundColor:
                              s.payment_plan === "Fully Paid"
                                ? "gold"
                                : s.payment_plan === "Installment"
                                ? "gray"
                                : "#f8f9fa", // light gray fallback
                            color:
                              s.payment_plan === "Fully Paid"
                                ? "black"
                                : "white",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                        >
                          {s.payment_plan}
                        </span>
                      </td>
                      <td>{handleDate(s.date_enrolled)}</td>
                      <td>
                        <button
                          disabled={isUpdating}
                          className="btn btn-lg text-warning"
                          onClick={() => updateButton(s.student_id)}
                        >
                          {isUpdating ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            <i className="bi bi-pencil-square"></i>
                          )}
                        </button>
                        <button className="btn btn-lg text-danger">
                          <i className="bi bi-trash"></i>
                        </button>
                        <button className="btn btn-lg">
                          <i class="bi bi-eye"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {currentStudents.length === 0 && (
                  <tr>
                    <td colSpan="13" className="text-center py-3 text-muted">
                      {filteredStudents.length === 0
                        ? "No students found."
                        : "No students on this page."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="card-footer d-flex justify-content-between align-items-center">
          <div>
            <small className="text-muted">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredStudents.length)} of{" "}
              {filteredStudents.length} students
              {filteredStudents.length !== students.length && (
                <span> (filtered from {students.length} total)</span>
              )}
            </small>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav aria-label="Student pagination">
              <ul className="pagination pagination-sm mb-0">
                {/* Previous Button */}
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {/* First Page */}
                {getPageNumbers()[0] > 1 && (
                  <>
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(1)}
                      >
                        1
                      </button>
                    </li>
                    {getPageNumbers()[0] > 2 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                  </>
                )}

                {/* Page Numbers */}
                {getPageNumbers().map((pageNum) => (
                  <li
                    key={pageNum}
                    className={`page-item ${
                      currentPage === pageNum ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                ))}

                {/* Last Page */}
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                  <>
                    {getPageNumbers()[getPageNumbers().length - 1] <
                      totalPages - 1 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </li>
                  </>
                )}

                {/* Next Button */}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
