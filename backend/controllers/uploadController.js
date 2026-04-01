import path from "path";
import { catchAsync } from "../utils/catchAsync.js";
import { env } from "../config/env.js";

export const uploadSingleFile = catchAsync(async (req, res) => {
  const file = req.file;
  res.json({
    success: true,
    data: {
      filename: file.filename,
      path: `/${env.uploadDir}/${path.basename(file.path)}`,
      mimetype: file.mimetype,
      size: file.size,
    },
  });
});
