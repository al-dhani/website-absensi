import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";

export default function Pengguna() {
  const [guru, setGuru] = useState([]);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const fetchGuru = async () => {
    try {
      const res = await api.get("/guru");
      setGuru(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchGuru();
  }, []);

  const filteredGuru = guru
    .filter((g) =>
      g.nama.toLowerCase().includes(search.toLowerCase()) ||
      g.nip.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, limit);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar />

      <div className="flex-1 p-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Data Guru
          </h1>
          <p className="text-gray-600">SMKN 46 Jakarta</p>
        </div>

        {/* CONTROL BAR */}
        <div className="flex justify-between items-center mb-6">

          <select
            className="border-2 border-gray-300 px-4 py-2 rounded-lg bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
          >
            <option value={10}>10 data</option>
            <option value={20}>20 data</option>
            <option value={30}>30 data</option>
          </select>

          <input
            type="text"
            placeholder="Cari guru..."
            className="px-4 py-2 rounded-lg border-2 border-gray-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <th className="p-4 text-left font-bold">NIP</th>
                  <th className="p-4 text-left font-bold">Nama Guru</th>
                </tr>
              </thead>

              <tbody>
                {filteredGuru.map((g, index) => (
                  <tr
                    key={g.id_guru}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <td className="p-4 font-medium text-gray-800">{g.nip}</td>
                    <td className="p-4 font-medium">{g.nama}</td>
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
