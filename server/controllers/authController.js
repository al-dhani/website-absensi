import db from "../db/connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (result.length === 0)
        return res.status(401).json({ message: "User tidak ditemukan" });

      const user = result[0];
      const valid = await bcrypt.compare(password, user.password);

      if (!valid)
        return res.status(401).json({ message: "Password salah" });

      const token = jwt.sign(
        { id_user: user.id_user, role: user.role },
        "secretkey"
      );

      res.json({ token, user });
    }
  );
};
