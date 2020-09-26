import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

import CreateUserService from "./CreateUserService";

describe("CreateUser", () => {
  it("should be able to create a new user", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUser.execute({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
    expect(user.email).toBe("test@test.com");
  });

  it("should not be able to create two users with the same email", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const userEmail = "test@test.com";

    await createUser.execute({
      name: "Test 1",
      email: userEmail,
      password: "123456",
    });

    expect(
      createUser.execute({
        name: "Test 2",
        email: userEmail,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
