import db from "../db/connection.js";

export const getClasses = (req, res) => {
  db.query("SELECT * FROM kelas", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
