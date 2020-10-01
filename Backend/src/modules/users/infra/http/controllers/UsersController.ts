import { container } from "tsyringe";
import { Request, Response } from "express";

import CreateUserService from "@modules/users/services/CreateUserService";
import { classToClass } from "class-transformer";

class UsersController {
  public static async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return res.json(classToClass(user));
  }
}

export default UsersController;
