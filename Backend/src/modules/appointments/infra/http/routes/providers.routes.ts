import { Router } from "express";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

import ProvidersController from "../controllers/ProvidersController";
import ProviderMonthAvailabilityController from "../controllers/ProviderMonthAvailabilityController";
import ProviderDayAvailabilityController from "../controllers/ProviderDayAvailabilityController";

const providersRouter = Router();

providersRouter.use(ensureAuthenticated);

providersRouter.get("/", ProvidersController.index);
providersRouter.post(
  "/:provider_id/month-availability",
  ProviderMonthAvailabilityController.index
);
providersRouter.post(
  "/:provider_id/day-availability",
  ProviderDayAvailabilityController.index
);

export default providersRouter;
