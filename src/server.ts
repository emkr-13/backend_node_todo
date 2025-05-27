import express from "express";
import routes from "./routes";
import cors from "cors";
import logger from "./utils/logger";
import { requestLogger } from "./middleware/loggerMiddleware";

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/api", routes);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Access the application at http://localhost:${PORT}`);
});
