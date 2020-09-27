"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var crypto_1 = __importDefault(require("crypto"));
var multer_1 = __importDefault(require("multer"));
var AppError_1 = __importDefault(require("@shared/errors/AppError"));
var tempFolder = path_1.default.resolve(__dirname, "..", "..", "tmp");
exports.default = {
    tmpFolder: tempFolder,
    uploadsFolder: path_1.default.resolve(tempFolder, "uploads"),
    storage: multer_1.default.diskStorage({
        destination: tempFolder,
        filename: function (req, file, callback) {
            var fileHash = crypto_1.default.randomBytes(10).toString("hex");
            var fileName = fileHash + "-" + file.originalname;
            return callback(null, fileName);
        },
    }),
    fileFilter: function (req, file, callback) {
        var ext = path_1.default.extname(file.originalname);
        if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
            return callback(new AppError_1.default("Only images are allowed"));
        }
        callback(null, true);
    },
};
