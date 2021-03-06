import { injectable, inject } from "tsyringe";
import path from "path";

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
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User does not exists.");
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email,
      },
      subject: "Recuperação de senha GoBarber",
      templateData: {
        file: path.resolve(__dirname, "..", "views", "forgot_password.hbs"),
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
          server_link: String(process.env.APP_API_URL),
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
