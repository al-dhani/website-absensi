import db from "../db/connection.js";

// GET ABSENSI DENGAN JOIN SISWA + KELAS
export const getAttendances = (req, res) => {
  const q = `
    SELECT k.id_kehadiran, k.tanggal, k.kehadiran,
           s.id_siswa, s.nama,
           c.nama_kelas AS kelas
    FROM kehadiran k
    JOIN siswa s ON k.id_siswa = s.id_siswa
    JOIN kelas c ON s.id_kelas = c.id_kelas
    ORDER BY k.id_kehadiran DESC
  `;

  db.query(q, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// POST TAMBAH ABSENSI
export const addAttendance = (req, res) => {
  const { id_siswa, tanggal, kehadiran } = req.body;

  const q = `
    INSERT INTO kehadiran (id_siswa, tanggal, kehadiran)
    VALUES (?, ?, ?)
  `;

  db.query(q, [id_siswa, tanggal, kehadiran], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Absensi berhasil ditambahkan" });
  });
};

export const updateAttendance = (req, res) => {
  const { id_siswa, tanggal, status } = req.body;

  const q = `
    INSERT INTO kehadiran (id_siswa, tanggal, kehadiran)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE kehadiran = VALUES(kehadiran)
  `;

  db.query(q, [id_siswa, tanggal, status], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Kehadiran berhasil diperbarui" });
  });
};

