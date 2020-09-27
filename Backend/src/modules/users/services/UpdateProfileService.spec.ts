import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

import UpdateProfileService from "./UpdateProfileService";

let fakeUsersRepository: FakeUsersRepository;
let updateProfileService: UpdateProfileService;
let fakeHashProvider: FakeHashProvider;

describe("UpdateProfile", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it("should be able to update the user name", async () => {
    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    await updateProfileService.execute({
      user_id: user.id,
      name: "newName",
      email: user.email,
    });

    expect(user.name).toBe("newName");
  });

  it("should be able to update the user email", async () => {
    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    await updateProfileService.execute({
      user_id: user.id,
      name: user.name,
      email: "new-email@test.com",
    });

    expect(user.email).toBe("new-email@test.com");
  });

  it("should be able to update the user password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    await updateProfileService.execute({
      user_id: user.id,
      name: user.name,
      email: user.email,
      password: "newPassword",
      old_password: "123456",
    });

    expect(user.password).toBe("newPassword");
  });

  it("should not be able to update the profile from a non existing user", async () => {
    await expect(
      updateProfileService.execute({
        user_id: "nonExistingId",
        name: "newName",
        email: "newEmail",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to change to another user email", async () => {
    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    await fakeUsersRepository.create({
      name: "Test",
      email: "already-used@test.com",
      password: "123456",
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: user.name,
        email: "already-used@test.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update the password with a wrong old password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: user.name,
        email: user.email,
        old_password: "wrongPassword",
        password: "newPassword",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update the password without the old password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: user.name,
        email: user.email,
        password: "newPassword",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
