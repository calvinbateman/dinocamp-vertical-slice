import { Router } from "express";
import { pool } from "../db.js";

export const usersRouter = Router();

usersRouter.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, email, created_at FROM users ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

usersRouter.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const { first_name, last_name, email } = req.body ?? {};

  if (first_name === undefined && last_name === undefined && email === undefined) {
    return res.status(400).json({ error: "No fields provided to update" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET
        first_name = COALESCE($2, first_name),
        last_name  = COALESCE($3, last_name),
        email      = COALESCE($4, email)
      WHERE id = $1
      RETURNING id, first_name, last_name, email, created_at
      `,
      [id, first_name ?? null, last_name ?? null, email ?? null]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    const msg = String(err?.message ?? "");
    if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) {
      return res.status(409).json({ error: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});