import { injectable, inject } from "tsyringe";
import { isAfter, addHours } from "date-fns";

import IUsersRepository from "../repositories/IUsersRepository";
import IUserTokensRepository from "../repositories/IUserTokensRepository";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";

import AppError from "@shared/errors/AppError";

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute(
    token: string,
    password: string,
    password_confirmation: string
  ): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError("User token does not exists.");
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError("User does not exists.");
    }

    const compareDate = addHours(userToken.created_at, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError("Token expired.");
    }

    if (password !== password_confirmation) {
      throw new AppError("The password must be confirmed");
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default SendForgotPasswordEmailService;
