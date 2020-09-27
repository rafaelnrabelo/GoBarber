import nodemailer, { Transporter } from "nodemailer";

import IMailProvider from "../models/IMailProvider";

class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then((account) => {
      this.client = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    });
  }

  public async sendMail(to: string, body: string): Promise<void> {
    const message = await this.client.sendMail({
      from: "Equipe GoBarber <equipe@gobarber.com>",
      to,
      subject: "Recuperação de senha GoBarber",
      text: body,
    });

    console.log(nodemailer.getTestMessageUrl(message));
  }
}

export default EtherealMailProvider;
