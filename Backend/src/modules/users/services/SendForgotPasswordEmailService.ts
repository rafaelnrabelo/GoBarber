import { injectable, inject } from "tsyringe";

import IUsersRepository from "../repositories/IUsersRepository";
import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import IUserTokensRepository from "../repositories/IUserTokensRepository";

import AppError from "@shared/errors/AppError";

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository
  ) {}

  public async execute(email: string): Promise<void> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (!checkUserExists) {
      throw new AppError("User does not exists.");
    }

    const { token } = await this.userTokensRepository.generate(
      checkUserExists.id
    );

    await this.mailProvider.sendMail(email, `Recuperação de Senha: ${token}`);
  }
}

export default SendForgotPasswordEmailService;
