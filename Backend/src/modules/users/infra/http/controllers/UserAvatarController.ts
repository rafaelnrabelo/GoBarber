import { container } from "tsyringe";
import { Request, Response } from "express";

import UpdateUserAvatarService from "@modules/users/services/UpdateUserAvatarService";

class UserAvatarController {
  public static async update(req: Request, res: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);
    const user = await updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  }
}

export default UserAvatarController;
