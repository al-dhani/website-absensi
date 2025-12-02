import db from "../db/connection.js";

export const getStudents = (req, res) => {
  const q = `
    SELECT s.id_siswa, s.nis, s.nama, s.gender, k.nama_kelas
    FROM siswa s
    JOIN kelas k ON s.id_kelas = k.id_kelas
    ORDER BY s.id_siswa ASC
  `;

  db.query(q, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

export const addStudent = (req, res) => {
  const { nis, nama, id_kelas, gender } = req.body;

  const q = "INSERT INTO siswa (nis, nama, id_kelas, gender) VALUES (?, ?, ?, ?)";
  db.query(q, [nis, nama, id_kelas, gender], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Student added", id: result.insertId });
  });
};

export const updateStudent = (req, res) => {
  const { nis, nama, id_kelas, gender } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE siswa SET nis=?, nama=?, id_kelas=?, gender=? WHERE id_siswa=?",
    [nis, nama, id_kelas, gender, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Student updated" });
    }
  );
};


export const deleteStudent = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM siswa WHERE id_siswa=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Student deleted" });
  });
};

export const getClasses = (req, res) => {
  db.query("SELECT * FROM kelas", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
