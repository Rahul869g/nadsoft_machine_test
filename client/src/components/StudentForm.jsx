import React, { useState, useEffect } from "react";
import {
  createStudent,
  updateStudent,
  getStudentById
} from "../api/studentApi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "react-bootstrap/Spinner"; // Import Spinner from react-bootstrap

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    email: "",
    marks: "" // Added marks field
  });
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    if (id && id !== "new") {
      const fetchStudent = async () => {
        try {
          setLoading(true); // Set loading true
          const student = await getStudentById(id);
          setFormData({
            first_name: student.first_name || "",
            last_name: student.last_name || "",
            dob: student.dob ? student.dob.split("T")[0] : "",
            email: student.email || "",
            marks: student.marks || ""
          });
        } catch (error) {
          Swal.fire("Error", "Failed to fetch student data", "error");
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id && id !== "new") {
        await updateStudent(id, formData);
        Swal.fire("Success", "Student updated successfully", "success");
      } else {
        await createStudent(formData);
        Swal.fire("Success", "Student added successfully", "success");
      }
      navigate("/");
    } catch (error) {
      Swal.fire("Error", "An error occurred while saving the data", "error");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">
        {id && id !== "new" ? "Edit Student" : "Add Student"}
      </h3>
      {loading ? ( // Show loading spinner
        <div className="d-flex justify-content-center mb-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Marks</label>
            <input
              type="number"
              className="form-control"
              name="marks"
              value={formData.marks}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success mt-2">
            {id && id !== "new" ? "Update" : "Create"}
          </button>
          <button
            type="button"
            className="btn btn-secondary mt-2 ms-2"
            onClick={() =>
              setFormData({
                first_name: "",
                last_name: "",
                dob: "",
                email: "",
                marks: ""
              })
            }
          >
            Clear
          </button>
        </form>
      )}
    </div>
  );
};

export default StudentForm;
