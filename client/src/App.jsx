import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EditStudentPage from "./pages/EditStudentPage";

function App() {
  return (
    <div className="container mt-5">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/edit/:id" element={<EditStudentPage />} />
      </Routes>
    </div>
  );
}

export default App;
