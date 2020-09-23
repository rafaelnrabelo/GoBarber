import { Router } from "express";
import { getCustomRepository } from "typeorm";
import { parseISO } from "date-fns";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

import AppointmentsRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentsRepository";
import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get("/", async (req, res) => {
  const { id: provider_id } = req.user;

  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find({
    where: { provider_id },
  });

  return res.json(appointments);
});

appointmentsRouter.post("/", async (req, res) => {
  const { id: provider_id } = req.user;
  const { date } = req.body;

  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentService();

  const appointment = await createAppointment.execute({
    date: parsedDate,
    provider_id,
  });

  return res.json(appointment);
});

export default appointmentsRouter;
