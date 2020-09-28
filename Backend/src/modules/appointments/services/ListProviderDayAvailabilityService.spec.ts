import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";

import FakeAppointmentsRepository from "@modules/appointments/repositories/fakes/FakeAppointmentsRepository";
import ListProviderDayAvailabilityService from "./ListProviderDayAvailabilityService";
import AppError from "@shared/errors/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe("ListProviderDayAvailability", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeUsersRepository,
      fakeAppointmentsRepository
    );
  });

  it("should be able to list the day availability from a provider", async () => {
    const providerUser = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    const customerUser = await fakeUsersRepository.create({
      name: "Test2",
      email: "test2@test.com",
      password: "123456",
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerUser.id,
      user_id: customerUser.id,
      date: new Date(2020, 0, 2, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerUser.id,
      user_id: customerUser.id,
      date: new Date(2020, 0, 2, 13, 0, 0),
    });

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 0, 2, 10, 0, 0).getTime();
    });

    const providerAvailability = await listProviderDayAvailability.execute({
      provider_id: providerUser.id,
      day: 2,
      month: 1,
      year: 2020,
    });

    expect(providerAvailability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: true },
        { hour: 12, available: false },
        { hour: 13, available: false },
        { hour: 14, available: true },
      ])
    );
  });

  it("should not be able to list the day availability from a non existing provider", async () => {
    await expect(
      listProviderDayAvailability.execute({
        provider_id: "invalidUserId",
        day: 2,
        month: 1,
        year: 2020,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
