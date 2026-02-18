import { Router } from "express";
import { pool } from "../db.js";
export const usersRouter = Router();
usersRouter.get("/", async (_req, res) => {
    try {
        const result = await pool.query("SELECT id, first_name, last_name, email, created_at FROM users ORDER BY id");
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
