import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";

export default function Attendance() {
  const [absensi, setAbsensi] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [kelasFilter, setKelasFilter] = useState("");
  const [limit, setLimit] = useState(10);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({});

  const fetchAbsensi = async () => {
    const res = await api.get("/attendances");
    setAbsensi(res.data);
  };

  const fetchSiswa = async () => {
    const res = await api.get("/students");
    setSiswaList(res.data);
  };

  const fetchClasses = async () => {
    const res = await api.get("/classes");
    setKelasList(res.data);
  };

  useEffect(() => {
    fetchAbsensi();
    fetchSiswa();
    fetchClasses();
  }, []);

  const handleRadioChange = (id_siswa, status) => {
    setSelectedStatus((prev) => ({ ...prev, [id_siswa]: status }));
  };

  const handleSaveConfirm = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);

      await Promise.all(
        Object.entries(selectedStatus).map(([id_siswa, status]) =>
          api.patch("/attendances/update", {
            id_siswa,
            status,
            tanggal: today,
          })
        )
      );

      setIsEditing(false);
      setSelectedStatus({});
      fetchAbsensi();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

      <Sidebar />

      <div className="flex-1 p-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Data Kehadiran
          </h1>
          <p className="text-gray-600">SMKN 12 Jakarta</p>
        </div>

        {/* CONTROL BAR */}
        <div className="flex justify-between items-center mb-6">

          {/* Filter kiri */}
          <div className="flex items-center gap-4">

            {/* Limit */}
            <select
              className="border-2 border-gray-300 px-4 py-2 rounded-lg bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
            >
              <option value={10}>10 data</option>
              <option value={20}>20 data</option>
              <option value={30}>30 data</option>
            </select>

            {/* Filter kelas */}
            <select
              className="border-2 border-gray-300 px-4 py-2 rounded-lg bg-white hover:border-purple-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              value={kelasFilter}
              onChange={(e) => setKelasFilter(e.target.value)}
            >
              <option value="">Semua Kelas</option>
              {kelasList.map((c) => (
                <option key={c.id_kelas} value={c.nama_kelas}>
                  {c.nama_kelas}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Mode */}
          <button
            onClick={() => {
              if (isEditing) {
                handleSaveConfirm();
              } else {
                const init = {};
                absensi.forEach((a) => { init[a.id_siswa] = a.kehadiran; });
                setSelectedStatus(init);
                setIsEditing(true);
              }
            }}
            className={`px-6 py-3 rounded-lg text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-medium 
            ${isEditing
              ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            }`}
          >
            {isEditing ? "✔️ Konfirmasi Kehadiran" : "📝 Input Kehadiran"}
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <th className="p-4 text-left font-bold">Nama</th>
                  <th className="p-4 text-left font-bold">Kelas</th>
                  <th className="p-4 text-left font-bold">Kehadiran</th>
                </tr>
              </thead>

              <tbody>
                {siswaList
                  .filter((s) => (kelasFilter ? s.nama_kelas === kelasFilter : true))
                  .slice(0, limit)
                  .map((s, index) => (
                    <tr
                      key={s.id_siswa}
                      className={`border-t ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="p-4 font-medium text-gray-800">{s.nama}</td>

                      <td className="p-4">
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {s.nama_kelas}
                        </span>
                      </td>

                      <td className="p-4">
                        {isEditing ? (
                          <div className="flex gap-3">

                            {["Hadir", "Terlambat", "Sakit", "Izin", "Alpha"].map((st) => (
                              <label
                                key={st}
                                className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-all cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={`status-${s.id_siswa}`}
                                  value={st}
                                  onChange={() => handleRadioChange(s.id_siswa, st)}
                                  checked={
                                    selectedStatus[s.id_siswa]
                                      ? selectedStatus[s.id_siswa] === st
                                      : absensi.find((a) => a.id_siswa === s.id_siswa)?.kehadiran === st
                                  }
                                  className="w-4 h-4"
                                />
                                <span className="text-sm font-medium">{st}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <span className="font-semibold">
                            {absensi.find((a) => a.id_siswa === s.id_siswa)?.kehadiran || "-"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>

        <p className="text-center mt-6 text-gray-500 text-sm">
          2025. SMKN 46 JAKARTA
        </p>
      </div>
    </div>
  );
}
