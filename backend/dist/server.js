import "./env.js";
import express from "express";
import { usersRouter } from "./routes/users.js";
const app = express();
app.use(express.json());
const port = Number(process.env.PORT ?? 4000);
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/api/users", usersRouter);
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
