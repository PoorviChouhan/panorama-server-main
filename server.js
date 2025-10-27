import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// ===== PostgreSQL routes =====
import { router as pgEmployees } from "./routes/pgEmployees.js";
import { router as pgClients } from "./routes/pgClients.js";

// ===== Invoice module routes =====
import clientRoutes from "./invoice/routes/clientRoutes.js";
import projectRoutes from "./invoice/routes/projectRoutes.js";
import employeeRouter from "./invoice/routes/employeeRoutes.js";

// ===== Swagger setup (from invoice module) =====
import { swaggerUi, swaggerSpec } from "./invoice/swagger.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// ===== PostgreSQL routes =====
app.use("/api/pg/employees", pgEmployees);
app.use("/api/pg/clients", pgClients);

// ===== Invoice routes =====
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/employee", employeeRouter);

// ===== Swagger Docs =====
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== Health check =====
app.get("/", (req, res) => res.send("✅ Combined Server is running..."));

// ===== Start server =====
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

export { JWT_SECRET };
