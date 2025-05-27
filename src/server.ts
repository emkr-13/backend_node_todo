import express from "express";
import routes from "./routes";
import cors from "cors";
import logger from "./utils/logger";
import { requestLogger } from "./middleware/loggerMiddleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api", routes);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Access the application at http://localhost:${PORT}`);
  logger.info(`Access API documentation at http://localhost:${PORT}/api-docs`);
  logger.info(`Access Swagger JSON at http://localhost:${PORT}/api-docs.json`);
});
