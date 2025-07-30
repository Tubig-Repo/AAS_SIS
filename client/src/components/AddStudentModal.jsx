import { useState } from "react";
import placeholderPhoto from "../assets/placeholder_photo.png"; // adjust path based on file location
import { useEffect } from "react";

export default function AddStudentModal({
  show,
  onClose,
  onSave,
  mode = "add",
  studentData = null,
  onEdit,
}) {
  const [form, setForm] = useState({
    student_id: "",
    LRN: "",
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
    date_enrolled: "",
    status: "",
    photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent non-numeric input for specific fields
    if (
      (name === "guardian_contact_number" && !/^\d*$/.test(value)) ||
      (name === "LRN" && !/^\d*$/.test(value))
    ) {
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();

      // Append fields in a specific order to ensure consistency
      const fieldOrder = [
        "student_id",
        "LRN",
        "first_name",
        "middle_name",
        "last_name",
        "birthdate",
        "gender",
        "level",
        "section",
        "guardian_name",
        "guardian_contact_number",
        "guardian_email",
        "address",
        "date_enrolled",
        "status",
        "photo",
      ];

      fieldOrder.forEach((key) => {
        if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });

      console.log("this is form", form);
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      let success;

      if (mode === "edit") {
        success = await onEdit(formData); // use update method
      } else {
        success = await onSave(formData); // use create method
      }

      if (success) {
        clearFields(); // Clear only if success
      } else {
        console.warn("Save failed – keeping modal open");
      }
    } catch (err) {
      console.error("Error during save:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFields = () => {
    setForm({
      student_id: "",
      LRN: "",
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
      date_enrolled: "",
      status: "",
    });
    setPreview(null);
    onClose();
  };

  useEffect(() => {
    if (mode === "edit" && studentData) {
      console.log(studentData.status);

      setForm((prev) => ({
        ...prev,
        ...studentData,
        // fix format date for editing function to fill the form
        birthdate: studentData.birthdate?.slice(0, 10), // <- Fix format
        date_enrolled: studentData.date_enrolled?.slice(0, 10), // <- Fix format
      }));

      if (studentData.photo && typeof studentData.photo === "string") {
        const photoPath = studentData.photo.startsWith("http")
          ? studentData.photo // external URL
          : `http://localhost:5000/uploads/${studentData.photo}`; // local backend path
        setPreview(photoPath);
      } else {
        setPreview(null);
      }
    } else if (mode === "add") {
      setForm({
        student_id: "",
        LRN: "",
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
        date_enrolled: "",
        status: "active", // Changed from "Active" to "active" to match select options
      });
      setPreview(null);
    }
  }, [studentData, mode, show]);

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
              <h5 className="modal-title">
                {mode === "edit" ? "Update Student" : "Add New Student"}
              </h5>
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
                  // If photo is in the DB but not found in the photos folder
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderPhoto;
                  }}
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
                ["LRN", "Learners Reference Number"],
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
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="graduated">Graduated</option>
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
                  ) : name === "LRN" ? (
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{12}"
                      maxLength="12"
                      title="Enter 12-digit Learner's Reference Number"
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
                      value={form[name] ?? ""}
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
                {isLoading
                  ? mode === "edit"
                    ? "Updating..."
                    : "Saving..."
                  : mode === "edit"
                  ? "Update Student"
                  : "Save Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
