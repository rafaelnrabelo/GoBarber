import { container } from "tsyringe";
import { Request, Response } from "express";

import ResetPasswordService from "@modules/users/services/ResetPasswordService";

class ResetPasswordController {
  public static async create(req: Request, res: Response): Promise<Response> {
    const { token, password } = req.body;

    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute(token, password);

    return res.status(204).send();
  }
}

export default ResetPasswordController;
