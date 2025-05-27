import { Request, Response, NextFunction } from "express";
import { AnyZodObject, z } from "zod";
import { sendResponse } from "../utils/responseHelper";
import logger from "../utils/logger";

export const validate =
  (schema: AnyZodObject, source: "body" | "params" | "query" = "body") =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Parse the request data against the schema
      await schema.parseAsync(req[source]);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format the validation errors
        const errorMessages = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        logger.warn(
          {
            validation: errorMessages,
            source,
          },
          "Validation failed"
        );

        // Send a 400 Bad Request response with the validation errors
        sendResponse(res, 400, "Validation failed", {
          errors: errorMessages,
        });
      } else {
        // If not a ZodError, pass to the next error handler
        next(error);
      }
    }
  };
