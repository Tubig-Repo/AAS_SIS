import { use, useEffect, useState } from "react";
import StatsCard from "../components/StatsCard";
export default function FeesManagement() {
  const [activeTab, setActiveTab] = useState("tuition");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFee, setEditingFee] = useState(null);

  // 🆕 Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sample data based on Abraham and Aysak School structure
  const [students, setStudents] = useState([]);
  const [tuitionFees, setTuitionFees] = useState([]);
  // const [tuitionFees, setTuitionFees] = useState([
  //   {
  //     id: 1,
  //     level: "Kinder",
  //     gradeLevel: "Kindergarten",
  //     cashFee: 20900,
  //     installmentRate: 10,
  //     downPaymentOptions: [
  //       { amount: 3000, remaining: 19990, monthly: 1999 },
  //       { amount: 5000, remaining: 17990, monthly: 1799 },
  //       { amount: 7000, remaining: 15990, monthly: 1599 },
  //     ],
  //     academicYear: "2024-2025",
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  //     level: "Elementary",
  //     gradeLevel: "Elementary",
  //     cashFee: 22000,
  //     installmentRate: 10,
  //     downPaymentOptions: [
  //       { amount: 3000, remaining: 21200, monthly: 2120 },
  //       { amount: 5000, remaining: 19200, monthly: 1920 },
  //       { amount: 7000, remaining: 17200, monthly: 1720 },
  //     ],
  //     academicYear: "2024-2025",
  //     status: "Active",
  //   },
  // ]);
  const getTuitionFee = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/tuition/tuition-rate",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      setTuitionFees(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getBasicStudent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/tuition/student-fees",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      setStudents(data || []);
    } catch (error) {
      console.log("Fetch Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditFee = (fee, type) => {
    setEditingFee({ ...fee, type });
    setShowAddModal(true);
  };

  const handleDeleteFee = (id, type) => {
    if (window.confirm("Are you sure you want to delete this fee?")) {
      if (type === "tuition") {
        setTuitionFees(tuitionFees.filter((fee) => fee.id !== id));
      } else {
        setCustomFees(customFees.filter((fee) => fee.id !== id));
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };
  useEffect(() => {
    getBasicStudent();
  }, []);
  useEffect(() => {
    getTuitionFee();
  }, []);
  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Fee Management</h2>
          <p className="text-muted mb-0">
            Manage tuition fees, miscellaneous fees, view student balance, and
            custom charges
          </p>
        </div>
        {/* <button
          className="btn btn-primary"
          onClick={() => {
            setEditingFee(null);
            setShowAddModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Fee
        </button> */}
      </div>

      {/* Stats Cards */}
      <StatsCard tuitioneFees={tuitionFees} />
      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "tuition" ? "active" : ""}`}
            onClick={() => setActiveTab("tuition")}
          >
            <i className="bi bi-piggy-bank me-2"></i>
            Tuition & Miscellaneous Fees
          </button>
        </li>
        {/* <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "custom" ? "active" : ""}`}
            onClick={() => setActiveTab("custom")}
          >
            <i className="bi bi-plus-square me-2"></i>
            Custom & Add-on Fees
          </button>
        </li> */}
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "balances" ? "active" : ""}`}
            onClick={() => setActiveTab("balances")}
          >
            <i className="bi bi-person-lines-fill me-2"></i>
            Students
          </button>
        </li>
      </ul>

      {/* Tuition Fees Tab */}
      {activeTab === "tuition" && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0">
              Tuition Fee Structure - Abraham and Aysak School
            </h5>
            <small className="text-muted">
              S.Y 2024-2025 • Cash vs Installment Payment Options
            </small>
          </div>
          <div className="card-body p-0">
            {tuitionFees.map((fee) => (
              <div key={fee.id} className="mb-4 p-4 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="mb-1">
                      <span
                        className={`badge ${
                          fee.level === "Kinder" ? "bg-warning" : "bg-primary"
                        } me-2`}
                      >
                        {fee.level}
                      </span>
                      {fee.gradeLevel}
                    </h5>
                    <small className="text-muted">
                      Academic Year: {fee.academicYear}
                    </small>
                  </div>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleEditFee(fee, "tuition")}
                    >
                      <i className="bi bi-pencil me-1"></i>Edit
                    </button>
                    {/* <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDeleteFee(fee.id, "tuition")}
                    >
                      <i className="bi bi-trash"></i>
                    </button> */}
                  </div>
                </div>

                <div className="row">
                  {/* Cash Payment */}
                  <div className="col-md-3">
                    <div className="card bg-success bg-opacity-10 border-success">
                      <div className="card-header bg-success text-white text-center">
                        <h6 className="mb-0">Cash Payment</h6>
                      </div>
                      <div className="card-body text-center">
                        <h4 className="text-success mb-0">
                          {formatCurrency(fee.cashFee)}
                        </h4>
                        <small className="text-muted">
                          Full payment discount
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Installment Payment */}
                  <div className="col-md-9">
                    <div className="card bg-info bg-opacity-10 border-info">
                      <div className="card-header bg-info text-white">
                        <h6 className="mb-0">
                          Installment Payment Options (+{fee.installmentRate}%)
                        </h6>
                        <small>
                          Total: {formatCurrency(fee.installmentFee)}
                        </small>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          {/* {fee.downPaymentOptions.map((option, index) => (
                            <div key={index} className="col-md-4 mb-3">
                              <div className="border rounded p-3 h-100">
                                <div className="text-center">
                                  <div className="badge bg-secondary mb-2">
                                    Option {index + 1}
                                  </div>
                                  <h6 className="text-primary">Down Payment</h6>
                                  <h5 className="text-dark">
                                    {formatCurrency(option.amount)}
                                  </h5>

                                  <hr className="my-2" />

                                  <div className="small text-muted">
                                    <div>
                                      Remaining:{" "}
                                      {formatCurrency(option.remaining)}
                                    </div>
                                    <div>
                                      10 months @{" "}
                                      <strong>
                                        {formatCurrency(option.monthly)}
                                      </strong>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))} */}
                        </div>
                        <div className="alert alert-info mt-3 mb-0">
                          <i className="bi bi-info-circle me-2"></i>
                          <small>
                            <strong>Note:</strong> Student's can also enroll for
                            as low as ₱2,000.00
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Student Balances Tab */}
      {activeTab === "balances" && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0">Student Balances</h5>
            <small className="text-muted">
              Based on current fee structures
            </small>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Grade</th>
                    <th>Academic Year</th>
                    <th>Plan</th>
                    <th>Total Fee</th>
                    <th>Total Paid</th>
                    <th>Balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    // find matching fee by level (mapped) and academic_year_id
                    console.log(tuitionFees);
                    console.log(student);
                    const matchedFee = tuitionFees.find(
                      (fee) =>
                        // match kinder
                        ((student.level === "Kindergarten" &&
                          fee.level === "Kinder") ||
                          // match any grade as Elementary
                          (student.level.startsWith("Grade") &&
                            fee.level === "Elementary")) &&
                        fee.academic_year_id === student.academic_year_id
                    );

                    let totalFee = 0;
                    if (matchedFee) {
                      if (student.payment_plan === "Fully Paid") {
                        // ✅ Fully paid → no additional charges
                        totalFee = 0;
                      } else if (student.payment_plan === "Installment") {
                        // ✅ Installment → add 10% on top of cash fee
                        totalFee = matchedFee.cash_fee * 1.1;
                        console.log(totalFee);
                      }
                    }
                    const balance = totalFee - student.payments_made;

                    return (
                      <tr key={student.id}>
                        <td>
                          {student.first_name} {student.middle_name}{" "}
                          {student.last_name}
                        </td>
                        <td>{student.level}</td>
                        <td>{student.academic_year}</td>
                        <td>
                          <span
                            className={`badge ${
                              student.payment_plan === "Installment"
                                ? "bg-success"
                                : "bg-info"
                            }`}
                          >
                            {student.payment_plan}
                          </span>
                        </td>
                        <td>{formatCurrency(totalFee)}</td>
                        <td>{formatCurrency(student.payments_made)}</td>
                        <td
                          className={
                            balance > 0
                              ? "text-danger fw-bold"
                              : "text-success fw-bold"
                          }
                        >
                          {formatCurrency(balance)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Add/Edit Modal */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingFee ? "Edit Fee" : "Add New Fee"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Level</label>
                      <select className="form-select">
                        <option value="">Select Level</option>
                        <option value="Kinder">Kinder</option>
                        <option value="Elementary">Elementary</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Academic Year</label>
                      <select className="form-select">
                        <option value="2024-2025">2024-2025</option>
                        <option value="2025-2026">2025-2026</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Cash Payment Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="20,900"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Installment Rate (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <h6 className="mb-3">Down Payment Options</h6>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Option 1 - Down Payment
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="3,000"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Option 2 - Down Payment
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="5,000"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Option 3 - Down Payment
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="7,000"
                      />
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <small>
                      <i className="bi bi-info-circle me-2"></i>Monthly payments
                      will be automatically calculated based on installment
                      total minus down payment, divided by 10 months.
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-primary">
                  {editingFee ? "Update Fee" : "Add Fee"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
