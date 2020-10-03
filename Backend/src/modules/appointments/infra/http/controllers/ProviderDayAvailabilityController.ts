import { container } from "tsyringe";
import { Request, Response } from "express";

import ListProviderDayAvailabilityService from "@modules/appointments/services/ListProviderDayAvailabilityService";

class ProviderDayAvailabilityController {
  public static async index(req: Request, res: Response): Promise<Response> {
    const { day, month, year } = req.query;
    const { provider_id } = req.params;

    const listProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService
    );

    const availability = await listProviderDayAvailability.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return res.json(availability);
  }
}

export default ProviderDayAvailabilityController;
