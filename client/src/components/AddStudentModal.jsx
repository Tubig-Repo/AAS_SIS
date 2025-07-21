import { useState } from "react";
import placeholderPhoto from "../assets/placeholder_photo.png"; // adjust path based on file location

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
    guardian_email: "",
    address: "",
    date_enrolled: "", // or use new Date().toISOString().slice(0, 10)
    status: "Active", // default value if needed
    photo: null, // this should be a File object
  });
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Optional: Prevent non-numeric input for contact number
    if (name === "guardian_contact_number" && !/^\d*$/.test(value)) {
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setForm({ ...form, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await onSave(form); // Wait for server response

      if (success) {
        clearFields(); // Only clear on success
      } else {
        console.warn("Save failed – keeping modal open");
      }
    } catch (err) {
      console.error("Error during save:", err);
    } finally {
      setIsLoading(false); // Always turn loading off
    }
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
      address: "",
      guardian_name: "",
      guardian_email: "",
      guardian_contact_number: "",
      photo: null,
      date_enrolled: "", // <-- add this!
      status: "Active", // <-- also re-add this if you want to keep the default
    });
    setPreview(null);
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
            <div className="d-flex justify-content-center mt-3">
              <label htmlFor="photoUpload" style={{ cursor: "pointer" }}>
                <img
                  src={preview || placeholderPhoto}
                  alt="student-avatar"
                  className="rounded-circle"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                  }}
                />
              </label>
              <input
                id="photoUpload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="modal-body row g-3">
              {[
                ["student_id", "Student ID"],
                ["first_name", "First Name"],
                ["middle_name", "Middle Name"],
                ["last_name", "Last Name"],
                ["birthdate", "Birthdate", "date"],
                ["date_enrolled", "Date Enrolled", "date"],
                ["gender", "Gender"],
                ["level", "Level"],
                ["section", "Section"],
                ["address", "Address"],
                ["status", "Status"],
                ["guardian_name", "Guardian Name"],
                ["guardian_email", "Guardian Email", "email"],
                ["guardian_contact_number", "Guardian Contact", "tel"],
              ].map(([name, label, type = "text"]) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label">{label}</label>

                  {name === "gender" ||
                  name === "level" ||
                  name === "status" ? (
                    <select
                      className="form-select"
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled hidden>
                        Select {label}
                      </option>
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
                      {name === "status" && (
                        <>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Graduated">Graduated</option>
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
              <button
                type="submit"
                className="btn btn-success"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
