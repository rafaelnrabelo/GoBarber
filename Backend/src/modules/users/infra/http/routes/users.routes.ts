import { Router } from "express";
import multer from "multer";
import { celebrate, Segments, Joi } from "celebrate";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

import UsersController from "../controllers/UsersController";
import UserAvatarController from "../controllers/UserAvatarController";

import uploadConfig from "@config/upload";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  UsersController.create
);

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  UserAvatarController.update
);

export default usersRouter;
