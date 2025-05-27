import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = process.hrtime();

  // Log request
  logger.info(
    {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    },
    "Incoming request"
  );

  // Capture the response
  const originalSend = res.send;
  res.send = function (body) {
    const diff = process.hrtime(start);
    const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

    // Log response
    logger.info(
      {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
      },
      "Request completed"
    );

    return originalSend.call(this, body);
  };

  next();
};
