import db from "../db/connection.js";

export const getGuru = (req, res) => {
  const q = `SELECT * FROM guru ORDER BY id_guru DESC`;

  db.query(q, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

