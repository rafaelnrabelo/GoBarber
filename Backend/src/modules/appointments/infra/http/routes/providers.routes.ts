import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

import ProvidersController from "../controllers/ProvidersController";
import ProviderMonthAvailabilityController from "../controllers/ProviderMonthAvailabilityController";
import ProviderDayAvailabilityController from "../controllers/ProviderDayAvailabilityController";

const providersRouter = Router();

providersRouter.use(ensureAuthenticated);

providersRouter.get("/", ProvidersController.index);
providersRouter.post(
  "/:provider_id/month-availability",
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      month: Joi.number().required(),
      year: Joi.number().required(),
    },
  }),
  ProviderMonthAvailabilityController.index
);
providersRouter.post(
  "/:provider_id/day-availability",
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      day: Joi.number().required(),
      month: Joi.number().required(),
      year: Joi.number().required(),
    },
  }),
  ProviderDayAvailabilityController.index
);

export default providersRouter;
