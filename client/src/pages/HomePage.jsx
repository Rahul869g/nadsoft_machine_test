import React from "react";
import StudentList from "../components/StudentList";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Student Management</h2>
        <Link to="/edit/new" className="btn btn-primary">
          Add New Student
        </Link>
      </div>
      <StudentList />
    </div>
  );
};

export default HomePage;
