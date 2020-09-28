import { parseISO } from "date-fns";
import { container } from "tsyringe";
import { Request, Response } from "express";

import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";

class AppointmentsController {
  public static async create(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    const { date, provider_id } = req.body;

    const parsedDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider_id,
      user_id,
    });

    return res.json(appointment);
  }
}

export default AppointmentsController;
