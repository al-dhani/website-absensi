import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";

export default function Dashboard() {
  // === STATISTIK HARI INI ===
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [totalHadir, setTotalHadir] = useState(0);
  const [totalTerlambat, setTotalTerlambat] = useState(0);

  // === FILTER & DATA TABEL ===
  const [kelasList, setKelasList] = useState([]);
  const [idKelas, setIdKelas] = useState("");
  const [limit, setLimit] = useState(10);
  const [searchNis, setSearchNis] = useState("");
  const [attendanceToday, setAttendanceToday] = useState([]);

  // === FETCH DATA AWAL ===
  useEffect(() => {
    // Total siswa
    api.get("/students").then((res) => setTotalSiswa(res.data.length));

    // Statistik kehadiran hari ini - REVISI
    api.get("/attendances/today").then((res) => {
      // Jika response berupa array data kehadiran
      if (Array.isArray(res.data)) {
        const hadirCount = res.data.filter(item => item.kehadiran === 'Hadir').length;
        const terlambatCount = res.data.filter(item => item.kehadiran === 'Terlambat').length;
        
        setTotalHadir(hadirCount);
        setTotalTerlambat(terlambatCount);
      } 
      // Jika response sudah dalam format object dengan properti hadir & terlambat
      else if (res.data.hadir !== undefined) {
        setTotalHadir(res.data.hadir || 0);
        setTotalTerlambat(res.data.terlambat || 0);
      }
    }).catch((err) => {
      console.error("Error fetching attendance stats:", err);
      setTotalHadir(0);
      setTotalTerlambat(0);
    });

    // Daftar kelas
    api.get("/classes").then((res) => setKelasList(res.data));
  }, []);

  // === FETCH DATA TABEL KEHADIRAN HARI INI ===
  useEffect(() => {
    if (idKelas || searchNis) {
      let url = `/attendances/today/class/${idKelas || "all"}?limit=${limit}`;
      if (searchNis) url += `&nis=${searchNis}`;

      api.get(url).then((res) => setAttendanceToday(res.data));
    } else {
      // Jika belum ada filter, ambil semua data hari ini (bisa di-limit)
      api
        .get(`/attendances/today?limit=${limit}`)
        .then((res) => setAttendanceToday(res.data));
    }
  }, [idKelas, limit, searchNis]);

  // === Badge warna status ===
  const getStatusBadge = (status) => {
    const badges = {
      Hadir: "bg-green-100 text-green-800 border-green-200",
      Terlambat: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Sakit: "bg-blue-100 text-blue-800 border-blue-200",
      Izin: "bg-purple-100 text-purple-800 border-purple-200",
      Alpha: "bg-red-100 text-red-800 border-red-200",
    };
    return badges[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
              <p className="text-gray-500">Ringkasan kehadiran siswa hari ini</p>
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Siswa</p>
                <p className="text-4xl font-bold text-gray-800">{totalSiswa}</p>
              </div>
              <div className="p-4 bg-indigo-100 rounded-xl">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Hadir Hari Ini</p>
                <p className="text-4xl font-bold text-green-600">{totalHadir}</p>
              </div>
              <div className="p-4 bg-green-100 rounded-xl">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Terlambat Hari Ini</p>
                <p className="text-4xl font-bold text-yellow-600">{totalTerlambat}</p>
              </div>
              <div className="p-4 bg-yellow-100 rounded-xl">
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Data Kehadiran Hari Ini</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Tampilkan:</label>
              <select
                className="border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Kelas:</label>
              <select
                className="border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 bg-white min-w-[180px]"
                value={idKelas}
                onChange={(e) => setIdKelas(e.target.value)}
              >
                <option value="">Semua Kelas</option>
                {kelasList.map((k) => (
                  <option key={k.id_kelas} value={k.id_kelas}>
                    {k.nama_kelas}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari NIS siswa..."
                className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
                value={searchNis}
                onChange={(e) => setSearchNis(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* TABEL KEHADIRAN HARI INI */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">NIS</th>
                  <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Nama</th>
                  <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Kelas</th>
                  <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {attendanceToday.length > 0 ? (
                  attendanceToday.map((row, idx) => (
                    <tr
                      key={row.id_absensi}
                      className="border-t border-gray-100 hover:bg-blue-50/50 transition-colors"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <td className="p-4 font-medium">{row.nis}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {row.nama.charAt(0).toUpperCase()}
                          </div>
                          <span>{row.nama}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {row.nama_kelas}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusBadge(row.kehadiran)}`}>
                          {row.kehadiran}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{row.keterangan || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-lg">Belum ada data kehadiran hari ini</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm font-medium">
            © 2025 SMKN 46 JAKARTA. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}