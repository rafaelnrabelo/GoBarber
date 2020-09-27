import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";

import ShowProfileService from "./ShowProfileService";

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe("ShowProfile", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it("should be able to show the user profile", async () => {
    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    await showProfileService.execute(user.id);

    expect(user.name).toBe("Test");
    expect(user.email).toBe("test@test.com");
  });

  it("should not be able to show the profile of a non existing user", async () => {
    await expect(
      showProfileService.execute("nonExistingId")
    ).rejects.toBeInstanceOf(AppError);
  });
});
