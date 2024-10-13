const studentModel = require("../models/studentModel");

// Get students with pagination
const getStudents = async (req, res) => {
  const { page = 1, limit = 3 } = req.query;

  try {
    // Fetch students with pagination
    const students = await studentModel.getStudents(page, limit);

    // Fetch total count of students
    const totalCount = await studentModel.getTotalCount();

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      students,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await studentModel.getStudentById(id);
    res.json(student);
  } catch (error) {
    res.status(404).json({ error: "Student not found" });
  }
};

// Create new student
const addStudent = async (req, res) => {
  const { first_name, last_name, dob, email } = req.body;
  try {
    const newStudent = await studentModel.addStudent({
      first_name,
      last_name,
      dob,
      email
    });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: "Error adding student" });
  }
};

// Update student
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, dob, email } = req.body;
  try {
    const updatedStudent = await studentModel.updateStudent(id, {
      first_name,
      last_name,
      dob,
      email
    });
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: "Error updating student" });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await studentModel.deleteStudent(id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: "Student not found" });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
};
