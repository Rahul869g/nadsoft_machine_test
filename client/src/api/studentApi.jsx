import axios from "axios";

const API_URL = "http://localhost:8000/api/students";

export const getStudents = async (page, limit) => {
  const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
  console.log(response.data);
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await axios.post(API_URL, studentData);
  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await axios.put(`${API_URL}/${id}`, studentData);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
