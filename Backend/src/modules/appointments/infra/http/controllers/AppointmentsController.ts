import { parseISO } from "date-fns";
import { container } from "tsyringe";
import { Request, Response } from "express";

import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";

class AppointmentsController {
  public static async create(req: Request, res: Response): Promise<Response> {
    const { id: provider_id } = req.user;
    const { date } = req.body;

    const parsedDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider_id,
    });

    return res.json(appointment);
  }
}

export default AppointmentsController;
