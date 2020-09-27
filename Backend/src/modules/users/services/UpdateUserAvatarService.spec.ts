import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";

import UpdateUserAvatarService from "./UpdateUserAvatarService";

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe("UpdateUserAvatar", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );
  });

  it("should be able to update a user avatar", async () => {
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
    await expect(
      updateUserAvatar.execute({
        avatarFilename: "test.png",
        user_id: "nonExistingId",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should delete the old avatar when updating to a new one", async () => {
    const deletefile = jest.spyOn(fakeStorageProvider, "deleteFile");

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
