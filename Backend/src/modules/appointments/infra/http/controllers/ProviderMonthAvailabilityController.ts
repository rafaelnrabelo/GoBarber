import { container } from "tsyringe";
import { Request, Response } from "express";

import ListProviderMonthAvailabilityService from "@modules/appointments/services/ListProviderMonthAvailabilityService";

class ProviderMonthAvailabilityController {
  public static async index(req: Request, res: Response): Promise<Response> {
    const { month, year } = req.query;
    const { provider_id } = req.params;

    const listProviderMonthAvailability = container.resolve(
      ListProviderMonthAvailabilityService
    );

    const availability = await listProviderMonthAvailability.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return res.json(availability);
  }
}

export default ProviderMonthAvailabilityController;
