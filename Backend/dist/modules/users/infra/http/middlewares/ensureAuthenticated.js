"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var auth_1 = __importDefault(require("@config/auth"));
var AppError_1 = __importDefault(require("@shared/errors/AppError"));
function ensureAuthenticated(req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.default("JWT token is missing.", 401);
    }
    var token = authHeader.split(" ")[1];
    var secret = auth_1.default.jwt.secret;
    try {
        var decoded = jsonwebtoken_1.verify(token, secret);
        var sub = decoded.sub;
        req.user = {
            id: sub,
        };
        return next();
    }
    catch (_a) {
        throw new AppError_1.default("Invalid JWT token.", 401);
    }
}
exports.default = ensureAuthenticated;
