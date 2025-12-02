import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";

export default function Attendance() {
  const [absensi, setAbsensi] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [kelasFilter, setKelasFilter] = useState("");
  const [limit, setLimit] = useState(10);

  const [isEditing, setIsEditing] = useState(false); // MODE EDIT
  const [selectedStatus, setSelectedStatus] = useState({}); // TEMP STORAGE

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

  // CHANGE RADIO VALUE
  const handleRadioChange = (id_siswa, status) => {
    setSelectedStatus((prev) => ({ ...prev, [id_siswa]: status }));
  };

  // SAVE ALL UPDATE
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
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-6">DATA KEHADIRAN</h1>

        {/* FILTER BAR */}
        <div className="flex justify-between mb-4 items-center">
          <div className="flex gap-3 items-center">
            <select
              className="border px-3 py-2 rounded"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>

            <select
              className="border px-3 py-2 rounded"
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

          {/* BUTTON MODE SWITCH */}
          <button
            onClick={() => {
            if (isEditing) {
              handleSaveConfirm();
            } else {
              // PRELOAD STATUS DARI DATABASE KE RADIO BUTTON
              const init = {};
              absensi.forEach((a) => {
                init[a.id_siswa] = a.kehadiran;
              });
              setSelectedStatus(init);
              setIsEditing(true);
            }
          }}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            {isEditing ? "Konfirmasi Kehadiran" : "Input Kehadiran"}
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Kelas</th>
                <th className="p-3 text-left">Kehadiran</th>
              </tr>
            </thead>
            <tbody>
              {siswaList
                .filter((s) => (kelasFilter ? s.nama_kelas === kelasFilter : true))
                .slice(0, limit)
                .map((s) => (
                  <tr key={s.id_siswa} className="border-t">
                    <td className="p-3">{s.nama}</td>
                    <td className="p-3">{s.nama_kelas}</td>
                    <td className="p-3">
                      {isEditing ? (
                        <div className="flex gap-4">
                          {["Hadir", "Terlambat", "Sakit", "Izin", "Alpha"].map((st) => (
                            <label key={st} className="flex gap-1 items-center">
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
                              />
                              {st}
                            </label>
                          ))}
                        </div>
                      ) : (
                        absensi.find((a) => a.id_siswa === s.id_siswa)?.kehadiran || "-"
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <p className="text-center mt-6 text-gray-500 text-sm">
          2025. SMKN 46 JAKARTA
        </p>
      </div>
    </div>
  );
}
