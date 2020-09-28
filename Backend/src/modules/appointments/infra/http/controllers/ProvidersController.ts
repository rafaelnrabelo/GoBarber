import { container } from "tsyringe";
import { Request, Response } from "express";

import ListProvidersService from "@modules/appointments/services/ListProvidersService";

class ProvidersController {
  public static async index(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;

    const listProviders = container.resolve(ListProvidersService);

    const providers = await listProviders.execute(user_id);

    providers.forEach((provider) => {
      delete provider.password;
    });

    return res.json(providers);
  }
}

export default ProvidersController;
