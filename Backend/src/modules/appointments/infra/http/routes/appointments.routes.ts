import { Router } from "express";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import AppointmentsController from "../controllers/AppointmentsController";

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

/* appointmentsRouter.get("/", async (req, res) => {
  const { id: provider_id } = req.user;

  const appointments = await appointmentsRepository.find({
    where: { provider_id },
  });

  return res.json(appointments);
}); */

appointmentsRouter.post("/", AppointmentsController.create);

export default appointmentsRouter;
