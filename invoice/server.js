import express from "express";
import dotenv from "dotenv";
import clientRoutes from "./routes/clientRoutes.js";
import projectRoutes from "./routes/projectRoutes.js"
import employeeRouter from "./routes/employeeRoutes.js"
import { swaggerUi, swaggerSpec } from "./swagger.js";

dotenv.config();
const app = express();
const port = 3000;
// 6
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/employee", employeeRouter);

app.get("/", (req, res) => res.send("Server is running ✅"));

app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
