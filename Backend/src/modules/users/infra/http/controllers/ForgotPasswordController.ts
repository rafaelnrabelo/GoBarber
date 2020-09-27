import { container } from "tsyringe";
import { Request, Response } from "express";

import SendForgotPasswordEmailService from "@modules/users/services/SendForgotPasswordEmailService";

class ForgotPasswordController {
  public static async create(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService
    );

    await sendForgotPasswordEmail.execute(email);

    return res.status(204).send();
  }
}

export default ForgotPasswordController;
