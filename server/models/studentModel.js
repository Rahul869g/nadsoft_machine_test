const pool = require("../config/db");

// Fetch all students with pagination
const getStudents = async (page, limit) => {
  const offset = (page - 1) * limit;
  const result = await pool.query("SELECT * FROM students LIMIT $1 OFFSET $2", [
    limit,
    offset
  ]);
  return result.rows;
};

// Fetch total count of students for pagination metadata
const getTotalCount = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM students");
  return parseInt(result.rows[0].count); // Return the total number of students
};

// Fetch single student with marks
const getStudentById = async (id) => {
  const student = await pool.query(
    "SELECT * FROM students WHERE student_id = $1",
    [id]
  );
  const marks = await pool.query("SELECT * FROM marks WHERE student_id = $1", [
    id
  ]);
  return { ...student.rows[0], marks: marks.rows };
};

// Add new student
const addStudent = async ({ first_name, last_name, dob, email }) => {
  const result = await pool.query(
    "INSERT INTO students (first_name, last_name, dob, email) VALUES ($1, $2, $3, $4) RETURNING *",
    [first_name, last_name, dob, email]
  );
  return result.rows[0];
};

// Update student
const updateStudent = async (id, { first_name, last_name, dob, email }) => {
  const result = await pool.query(
    "UPDATE students SET first_name = $1, last_name = $2, dob = $3, email = $4 WHERE student_id = $5 RETURNING *",
    [first_name, last_name, dob, email, id]
  );
  return result.rows[0];
};

// Delete student
const deleteStudent = async (id) => {
  await pool.query("DELETE FROM students WHERE student_id = $1", [id]);
};

module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  getTotalCount
};
