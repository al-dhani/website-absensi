import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";

export default function Pengguna() {
  const [guru, setGuru] = useState([]);

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

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-6">DATA GURU</h1>

        <div className="bg-white rounded shadow">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">NIP</th>
                <th className="p-3 text-left">Nama Guru</th>
              </tr>
            </thead>
            <tbody>
              {guru.map((g) => (
                <tr key={g.id_guru} className="border-t">
                  <td className="p-3">{g.nip}</td>
                  <td className="p-3">{g.nama}</td>
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
