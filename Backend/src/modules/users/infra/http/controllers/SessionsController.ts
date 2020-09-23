import { container } from "tsyringe";
import { Request, Response } from "express";

import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";

class SessionsController {
  public static async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({ email, password });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    });
  }
}

export default SessionsController;
