import { Router } from "express";
import multer from "multer";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

import UsersController from "../controllers/UsersController";
import UserAvatarController from "../controllers/UserAvatarController";

import uploadConfig from "@config/upload";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post("/", UsersController.create);

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  UserAvatarController.update
);

export default usersRouter;
