import { container } from "tsyringe";
import { Request, Response } from "express";

import ListProviderAppointmentsService from "@modules/appointments/services/ListProviderAppointmentsService";

class ProviderAppointmentsController {
  public static async index(req: Request, res: Response): Promise<Response> {
    const { day, month, year } = req.body;
    const { id: provider_id } = req.user;

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService
    );

    const appointments = await listProviderAppointments.execute({
      provider_id,
      day,
      month,
      year,
    });

    return res.json(appointments);
  }
}

export default ProviderAppointmentsController;
