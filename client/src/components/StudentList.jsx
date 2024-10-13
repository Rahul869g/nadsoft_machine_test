import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStudents, deleteStudent } from "../api/studentApi";
import Swal from "sweetalert2";
import Spinner from "react-bootstrap/Spinner"; // Ensure to install react-bootstrap

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true); // Set loading true
        const { students, pagination } = await getStudents(page, limit);
        setStudents(students || []);
        setTotalPages(pagination?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false); // Set loading false
      }
    };
    fetchStudents();
  }, [page, limit]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteStudent(id);
        setStudents(students.filter((student) => student.student_id !== id));
        Swal.fire("Deleted!", "Student record has been deleted.", "success");
      }
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Student List</h3>
      {loading ? ( // Show loading spinner
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.student_id}>
                  <td>{student.first_name}</td>
                  <td>{student.last_name}</td>
                  <td>{student.email}</td>
                  <td>
                    <Link
                      to={`/edit/${student.student_id}`}
                      className="btn btn-primary btn-sm me-2"
                      data-toggle="tooltip"
                      title="Edit Student"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(student.student_id)}
                      data-toggle="tooltip"
                      title="Delete Student"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <nav>
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
          </li>
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default StudentList;
