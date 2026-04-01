import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError.js";

export const validateRequest =
  (schema) =>
  (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Validation failed",
          result.error.flatten()
        )
      );
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;
    next();
  };
