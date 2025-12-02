import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-700 text-white min-h-screen p-5">
      <h2 className="text-2xl font-bold mb-6">ADMIN ABSENSI</h2>

      <nav className="flex flex-col gap-3">
        <Link to="/admin" className="hover:bg-blue-600 p-2 rounded">
          Dashboard
        </Link>

        <Link to="/admin/attendance" className="hover:bg-blue-600 p-2 rounded">
          Data Absensi
        </Link>

        <Link to="/admin/students" className="hover:bg-blue-600 p-2 rounded">
          Data Siswa
        </Link>

        <Link to="/admin/pengguna" className="hover:bg-blue-600 p-2 rounded">
          Pengguna
        </Link>

        <Link
          to="/"
          onClick={() => localStorage.removeItem("token")}
          className="bg-red-600 mt-10 p-2 rounded text-center hover:bg-red-700"
        >
          Logout
        </Link>
      </nav>
    </div>
  );
}
