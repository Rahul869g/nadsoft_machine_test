const pool = require("../config/db");

// Fetch students with pagination and marks
const getStudents = async (page, limit) => {
  const offset = (page - 1) * limit;

  // Fetch students
  const studentsResult = await pool.query(
    "SELECT * FROM students LIMIT $1 OFFSET $2",
    [limit, offset]
  );
  const students = studentsResult.rows;

  // Fetch overall marks for each student
  const studentIds = students.map((student) => student.student_id);
  const marksResult = await pool.query(
    "SELECT student_id, marks FROM marks WHERE student_id = ANY($1::int[])",
    [studentIds]
  );

  const marks = marksResult.rows;

  // Map marks to the corresponding student
  const studentsWithMarks = students.map((student) => {
    const studentMarks = marks.find(
      (mark) => mark.student_id === student.student_id
    );
    return {
      ...student,
      marks: studentMarks ? studentMarks.marks : null // Include marks or null if not found
    };
  });

  return studentsWithMarks;
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
  return {
    ...student.rows[0],
    marks: marks.rows.length > 0 ? marks.rows[0].marks : null
  };
};

// Add new student with marks
const addStudent = async ({ first_name, last_name, dob, email, marks }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert the new student
    const result = await client.query(
      "INSERT INTO students (first_name, last_name, dob, email) VALUES ($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, dob, email]
    );
    const newStudent = result.rows[0];

    // Insert marks if provided
    if (marks !== undefined) {
      await client.query(
        "INSERT INTO marks (student_id, marks) VALUES ($1, $2)",
        [newStudent.student_id, marks]
      );
    }

    await client.query("COMMIT");
    return { ...newStudent, marks };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Update student details and marks
const updateStudent = async (
  id,
  { first_name, last_name, dob, email, marks }
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update student details
    const result = await client.query(
      "UPDATE students SET first_name = $1, last_name = $2, dob = $3, email = $4 WHERE student_id = $5 RETURNING *",
      [first_name, last_name, dob, email, id]
    );
    const updatedStudent = result.rows[0];

    // Update marks if provided
    if (marks !== undefined) {
      const markExists = await client.query(
        "SELECT * FROM marks WHERE student_id = $1",
        [id]
      );

      if (markExists.rows.length > 0) {
        // Update existing marks
        await client.query(
          "UPDATE marks SET marks = $1 WHERE student_id = $2",
          [marks, id]
        );
      } else {
        // Insert marks if not already present
        await client.query(
          "INSERT INTO marks (student_id, marks) VALUES ($1, $2)",
          [id, marks]
        );
      }
    }

    await client.query("COMMIT");
    return { ...updatedStudent, marks };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Delete student
const deleteStudent = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM marks WHERE student_id = $1", [id]);
    await client.query("DELETE FROM students WHERE student_id = $1", [id]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  getTotalCount
};
