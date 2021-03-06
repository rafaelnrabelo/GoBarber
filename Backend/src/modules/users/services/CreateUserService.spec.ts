import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

import CreateUserService from "./CreateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe("CreateUser", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
  });

  it("should be able to create a new user", async () => {
    const user = await createUser.execute({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
    expect(user.email).toBe("test@test.com");
  });

  it("should not be able to create two users with the same email", async () => {
    const userEmail = "test@test.com";

    await createUser.execute({
      name: "Test 1",
      email: userEmail,
      password: "123456",
    });

    await expect(
      createUser.execute({
        name: "Test 2",
        email: userEmail,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
