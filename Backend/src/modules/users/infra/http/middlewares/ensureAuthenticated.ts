import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import authConfig from "@config/auth";
import AppError from "@shared/errors/AppError";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}
function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token is missing.", 401);
  }
  const token = authHeader.split(" ")[1];

  const { secret } = authConfig.jwt;

  try {
    const decoded = verify(token, secret);

    const { sub } = decoded as TokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError("Invalid JWT token.", 401);
  }
}

export default ensureAuthenticated;
