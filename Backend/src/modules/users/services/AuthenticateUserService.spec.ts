import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

import CreateUserService from "./CreateUserService";
import AuthenticateUserService from "./AuthenticateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe("AuthenticateUser", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it("should be able to authenticate", async () => {
    const user = await createUser.execute({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    const response = await authenticateUser.execute({
      email: "test@test.com",
      password: "123456",
    });

    expect(response).toHaveProperty("token");
    expect(response.user).toEqual(user);
  });

  it("should not be able to authenticate with the wrong password", async () => {
    await createUser.execute({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    await expect(
      authenticateUser.execute({
        email: "test@test.com",
        password: "wrongPassword",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with a non existing user", async () => {
    await expect(
      authenticateUser.execute({
        email: "testwrong@test.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});