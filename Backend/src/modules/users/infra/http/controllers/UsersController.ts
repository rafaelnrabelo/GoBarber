import { container } from "tsyringe";
import { Request, Response } from "express";

import CreateUserService from "@modules/users/services/CreateUserService";

class UsersController {
  public static async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  }
}

export default UsersController;
