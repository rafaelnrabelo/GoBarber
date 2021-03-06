import { container } from "tsyringe";
import { Request, Response } from "express";
import { classToClass } from "class-transformer";

import UpdateUserAvatarService from "@modules/users/services/UpdateUserAvatarService";

class UserAvatarController {
  public static async update(req: Request, res: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);
    const user = await updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    return res.json(classToClass(user));
  }
}

export default UserAvatarController;
