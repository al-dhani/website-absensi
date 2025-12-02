import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [limit, setLimit] = useState(5);
  const [showForm, setShowForm] = useState(false);

  // form states
  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [gender, setGender] = useState("L");
  const [kelasList, setKelasList] = useState([]);
  const [id_kelas, setIdKelas] = useState("");
  const [error, setError] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    api.get("/students").then((res) => setStudents(res.data));
    api.get("/classes").then((res) => setKelasList(res.data));
  }, []);

  const filteredStudents = students.slice(0, limit);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent.id_siswa}`, { nis, nama, gender, id_kelas });
      } else {
        await api.post("/students", { nis, nama, gender, id_kelas });
      }

      setShowForm(false);
      setEditingStudent(null);
      setNis("");
      setNama("");
      setGender("L");
      setIdKelas("");
      api.get("/students").then((res) => setStudents(res.data));
    } catch (err) {
      setError("Gagal menyimpan data siswa");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus siswa ini?")) return;

    try {
      await api.delete(`/students/${id}`);
      api.get("/students").then((res) => setStudents(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Data Siswa
          </h1>
          <p className="text-gray-600">SMKN 12 Jakarta</p>
        </div>

        {/* Controls Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Tampilkan:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="border-2 border-gray-300 px-4 py-2 rounded-lg bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none cursor-pointer"
            >
              <option value={5}>5 data</option>
              <option value={10}>10 data</option>
              <option value={15}>15 data</option>
            </select>
          </div>

          <button
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium flex items-center gap-2"
            onClick={() => {
              setShowForm(true);
              setEditingStudent(null);
              setNis("");
              setNama("");
              setGender("L");
              setIdKelas("");
              setError("");
            }}
          >
            <span className="text-xl">+</span>
            Tambah Siswa
          </button>
        </div>

        {/* FORM TAMBAH/EDIT SISWA */}
        {showForm && (
          <div className="bg-white shadow-2xl rounded-2xl mb-6 max-w-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                {editingStudent ? "✏️ Edit Siswa" : "➕ Tambah Siswa Baru"}
              </h2>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    NIS (Nomor Induk Siswa)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 12345"
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ahmad Hidayat"
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Jenis Kelamin
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-3 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-all">
                      <input
                        type="radio"
                        value="L"
                        checked={gender === "L"}
                        onChange={() => setGender("L")}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-medium">👨 Laki-laki</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-3 rounded-lg border-2 border-gray-300 hover:border-pink-500 transition-all">
                      <input
                        type="radio"
                        value="P"
                        checked={gender === "P"}
                        onChange={() => setGender("P")}
                        className="w-4 h-4 text-pink-600"
                      />
                      <span className="font-medium">👩 Perempuan</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kelas
                  </label>
                  <select
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none cursor-pointer"
                    value={id_kelas}
                    onChange={(e) => setIdKelas(e.target.value)}
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {kelasList.map((k) => (
                      <option key={k.id_kelas} value={k.id_kelas}>
                        {k.nama_kelas}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-medium"
                  >
                    💾 Simpan
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingStudent(null);
                      setError("");
                    }}
                    className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-medium"
                  >
                    ✖️ Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <th className="p-4 text-left font-bold">NIS</th>
                  <th className="p-4 text-left font-bold">Nama Lengkap</th>
                  <th className="p-4 text-left font-bold">Kelas</th>
                  <th className="p-4 text-left font-bold">Jenis Kelamin</th>
                  <th className="p-4 text-center font-bold">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      <div className="text-6xl mb-4">📚</div>
                      <p className="text-lg">Belum ada data siswa</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s, index) => (
                    <tr
                      key={s.id_siswa}
                      className={`border-t hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-4 font-semibold text-gray-700">{s.nis}</td>
                      <td className="p-4 font-medium text-gray-800">{s.nama}</td>
                      <td className="p-4">
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {s.nama_kelas}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            s.gender === "L"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-pink-100 text-pink-700"
                          }`}
                        >
                          {s.gender === "L" ? "👨 Laki-laki" : "👩 Perempuan"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-medium"
                            onClick={() => {
                              setEditingStudent(s);
                              setShowForm(true);
                              setNis(s.nis);
                              setNama(s.nama);
                              setGender(s.gender);
                              setIdKelas(s.id_kelas);
                              setError("");
                            }}
                            title="Edit"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-medium"
                            onClick={() => handleDelete(s.id_siswa)}
                            title="Hapus"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-bold text-blue-600">{filteredStudents.length}</span> dari{" "}
              <span className="font-bold text-blue-600">{students.length}</span> total siswa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}