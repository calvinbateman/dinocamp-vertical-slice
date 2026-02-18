import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load repo-root .env (works from src/ via tsx and from dist/ after build)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
