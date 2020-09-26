import path from "path";
import crypto from "crypto";
import multer, { Options } from "multer";

import AppError from "@shared/errors/AppError";

interface Directories {
  tmpFolder: string;
  uploadsFolder: string;
}

const tempFolder = path.resolve(__dirname, "..", "..", "tmp");

export default {
  tmpFolder: tempFolder,
  uploadsFolder: path.resolve(tempFolder, "uploads"),
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
} as Options & Directories;
