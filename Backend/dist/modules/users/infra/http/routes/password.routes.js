"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ForgotPasswordController_1 = __importDefault(require("../controllers/ForgotPasswordController"));
var ResetPasswordController_1 = __importDefault(require("../controllers/ResetPasswordController"));
var passwordRouter = express_1.Router();
passwordRouter.post("/forgot", ForgotPasswordController_1.default.create);
passwordRouter.post("/reset", ResetPasswordController_1.default.create);
exports.default = passwordRouter;
