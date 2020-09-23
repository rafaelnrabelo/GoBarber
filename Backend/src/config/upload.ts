import path from "path";
import crypto from "crypto";
import multer, { Options } from "multer";

import AppError from "@shared/errors/AppError";

interface Directory {
  directory: string;
}

const tempFolder = path.resolve(__dirname, "..", "..", "tmp");

export default {
  directory: tempFolder,
  storage: multer.diskStorage({
    destination: tempFolder,
    filename(req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
  fileFilter(req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return callback(new AppError("Only images are allowed"));
    }
    callback(null, true);
  },
} as Options & Directory;
