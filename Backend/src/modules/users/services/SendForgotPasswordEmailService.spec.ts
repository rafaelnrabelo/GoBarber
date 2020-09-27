import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";

import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";

import AppError from "@shared/errors/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe("SendForgotPasswordEmail", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  });

  it("should be able to send an email to recover the password", async () => {
    const sendMail = jest.spyOn(fakeMailProvider, "sendMail");

    await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    await sendForgotPasswordEmail.execute("test@test.com");

    expect(sendMail).toBeCalled();
  });

  it("should not be able to send an email to a non existing user", async () => {
    await expect(
      sendForgotPasswordEmail.execute("non-existing-user@test.com")
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should generate a forgot password token", async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, "generate");

    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    await sendForgotPasswordEmail.execute("test@test.com");

    expect(generateToken).toBeCalledWith(user.id);
  });
});
