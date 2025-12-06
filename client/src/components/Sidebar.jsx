import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Users, User, LogOut } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/attendance", icon: ClipboardList, label: "Data Absensi" },
    { path: "/admin/students", icon: Users, label: "Data Siswa" },
    { path: "/admin/pengguna", icon: User, label: "Pengguna" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white min-h-screen flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <ClipboardList className="text-blue-800" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">ADMIN</h2>
            <p className="text-xs text-blue-300">Sistem Absensi</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-white text-blue-800 shadow-lg font-semibold"
                    : "text-blue-100 hover:bg-blue-700 hover:translate-x-1"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-700">
        <Link
          to="/"
          onClick={() => localStorage.removeItem("token")}
          className="flex items-center justify-center gap-2 bg-red-600 p-3 rounded-lg text-center hover:bg-red-700 transition-all duration-200 hover:shadow-lg font-semibold"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
}