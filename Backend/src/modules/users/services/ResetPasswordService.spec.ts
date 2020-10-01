import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";

import ResetPasswordService from "./ResetPasswordService";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

import AppError from "@shared/errors/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe("ResetPassword", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });

  it("should be able to reset a user password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    const generateHash = jest.spyOn(fakeHashProvider, "generateHash");

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPasswordService.execute(token, "newPassword", "newPassword");

    expect(generateHash).toBeCalledWith("newPassword");
    expect(user.password).toBe("newPassword");
  });

  it("should not be able to reset the password with a invalid userToken", async () => {
    await expect(
      resetPasswordService.execute(
        "invalidUserToken",
        "newPassword",
        "newPassword"
      )
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset the password from a non existing user", async () => {
    const { token } = await fakeUserTokensRepository.generate("invalidUserId");

    await expect(
      resetPasswordService.execute(token, "newPassword", "newPassword")
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset the password after 2 hours passed", async () => {
    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute(token, "newPassword", "newPassword")
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset without confirm the password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await expect(
      resetPasswordService.execute(token, "newPassword", "invalidConfirmation")
    ).rejects.toBeInstanceOf(AppError);
  });
});
