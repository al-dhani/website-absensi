import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Pengguna from "./pages/Pengguna";
import Attendance from "./pages/Attendance";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/students" element={<Students />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/admin/pengguna" element={<Pengguna />} />
      </Routes>
    </BrowserRouter>
  );
}
