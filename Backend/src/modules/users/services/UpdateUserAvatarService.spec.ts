import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";

import UpdateUserAvatarService from "./UpdateUserAvatarService";

describe("UpdateUserAvatar", () => {
  it("should be able to update a user avatar", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    await updateUserAvatar.execute({
      avatarFilename: "test.png",
      user_id: user.id,
    });

    expect(user.avatar).toBe("test.png");
  });

  it("should not be able to update the avatar from a non existing user", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    expect(
      updateUserAvatar.execute({
        avatarFilename: "test.png",
        user_id: "nonExistingId",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should delete the old avatar when updating to a new one", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deletefile = jest.spyOn(fakeStorageProvider, "deleteFile");

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    await updateUserAvatar.execute({
      avatarFilename: "test.png",
      user_id: user.id,
    });

    await updateUserAvatar.execute({
      avatarFilename: "newAvatar.png",
      user_id: user.id,
    });

    expect(deletefile).toHaveBeenCalledWith("test.png");
    expect(user.avatar).toBe("newAvatar.png");
  });
});
