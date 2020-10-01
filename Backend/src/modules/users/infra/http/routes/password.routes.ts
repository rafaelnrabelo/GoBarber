import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ForgotPasswordController from "../controllers/ForgotPasswordController";
import ResetPasswordController from "../controllers/ResetPasswordController";

const passwordRouter = Router();

passwordRouter.post(
  "/forgot",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  ForgotPasswordController.create
);
passwordRouter.post(
  "/reset",
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().valid(Joi.ref("password")).required(),
    },
  }),
  ResetPasswordController.create
);

export default passwordRouter;
