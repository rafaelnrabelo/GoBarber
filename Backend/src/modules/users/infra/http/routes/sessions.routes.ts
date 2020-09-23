import { Router } from "express";

import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";

const sessionsRouter = Router();

sessionsRouter.post("/", async (req, res) => {
  const { email, password } = req.body;

  const authenticateUser = new AuthenticateUserService();

  const { user, token } = await authenticateUser.execute({ email, password });

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
    token,
  });
});

export default sessionsRouter;
