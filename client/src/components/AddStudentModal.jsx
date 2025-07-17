import { useState } from "react";

export default function AddStudentModal({ show, onClose, onSave }) {
  const [form, setForm] = useState({
    student_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    birthdate: "",
    gender: "",
    level: "",
    section: "",
    guardian_name: "",
    guardian_contact_number: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Optional: Prevent non-numeric input for contact number
    if (name === "guardian_contact_number" && !/^\d*$/.test(value)) {
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const clearFields = () => {
    setForm({
      student_id: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      birthdate: "",
      gender: "",
      level: "",
      section: "",
      guardian_name: "",
      guardian_contact_number: "",
    });

    onClose();
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      style={{
        display: show ? "block" : "none",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Add New Student</h5>
              <button
                type="button"
                className="btn-close"
                onClick={clearFields}
              ></button>
            </div>

            <div className="modal-body row g-3">
              {[
                ["student_id", "Student ID"],
                ["first_name", "First Name"],
                ["middle_name", "Middle Name"],
                ["last_name", "Last Name"],
                ["birthdate", "Birthdate", "date"],
                ["gender", "Gender"],
                ["level", "Level"],
                ["section", "Section"],
                ["guardian_name", "Guardian Name"],
                ["guardian_contact_number", "Guardian Contact", "tel"],
              ].map(([name, label, type = "text"]) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label">{label}</label>

                  {name === "gender" || name === "level" ? (
                    <select
                      className="form-select"
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select {label}</option>
                      {name === "gender" && (
                        <>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </>
                      )}
                      {name === "level" && (
                        <>
                          <option value="Kindergarten">Kindergarten</option>
                          <option value="Grade 1">Grade 1</option>
                          <option value="Grade 2">Grade 2</option>
                          <option value="Grade 3">Grade 3</option>
                          <option value="Grade 4">Grade 4</option>
                        </>
                      )}
                    </select>
                  ) : name === "guardian_contact_number" ? (
                    <input
                      type="tel"
                      pattern="[0-9]{11}"
                      maxLength="11"
                      title="Enter 11-digit contact number"
                      className="form-control"
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <input
                      type={type}
                      className="form-control"
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      required
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearFields}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Save Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
