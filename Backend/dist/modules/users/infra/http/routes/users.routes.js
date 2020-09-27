"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = __importDefault(require("multer"));
var ensureAuthenticated_1 = __importDefault(require("@modules/users/infra/http/middlewares/ensureAuthenticated"));
var UsersController_1 = __importDefault(require("../controllers/UsersController"));
var UserAvatarController_1 = __importDefault(require("../controllers/UserAvatarController"));
var upload_1 = __importDefault(require("@config/upload"));
var usersRouter = express_1.Router();
var upload = multer_1.default(upload_1.default);
usersRouter.post("/", UsersController_1.default.create);
usersRouter.patch("/avatar", ensureAuthenticated_1.default, upload.single("avatar"), UserAvatarController_1.default.update);
exports.default = usersRouter;
