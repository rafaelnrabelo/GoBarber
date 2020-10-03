import { container } from "tsyringe";
import { Request, Response } from "express";
import { classToClass } from "class-transformer";

import ListProviderAppointmentsService from "@modules/appointments/services/ListProviderAppointmentsService";

class ProviderAppointmentsController {
  public static async index(req: Request, res: Response): Promise<Response> {
    const { day, month, year } = req.query;
    const { id: provider_id } = req.user;

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService
    );

    const appointments = await listProviderAppointments.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return res.json(classToClass(appointments));
  }
}

export default ProviderAppointmentsController;
