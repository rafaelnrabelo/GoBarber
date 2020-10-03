import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";

import FakeAppointmentsRepository from "@modules/appointments/repositories/fakes/FakeAppointmentsRepository";
import ListProviderMonthAvailabilityService from "./ListProviderMonthAvailabilityService";
import AppError from "@shared/errors/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe("ListProviderMonthAvailability", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeUsersRepository,
      fakeAppointmentsRepository
    );
  });

  it("should be able to list the month availability from a provider", async () => {
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
      date: new Date(2020, 0, 2, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerUser.id,
      user_id: customerUser.id,
      date: new Date(2020, 0, 2, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerUser.id,
      user_id: customerUser.id,
      date: new Date(2020, 0, 2, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerUser.id,
      user_id: customerUser.id,
      date: new Date(2020, 0, 2, 11, 0, 0),
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

    await fakeAppointmentsRepository.create({
      provider_id: providerUser.id,
      user_id: customerUser.id,
      date: new Date(2020, 0, 2, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerUser.id,
      user_id: customerUser.id,
      date: new Date(2020, 0, 2, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerUser.id,
      user_id: customerUser.id,
      date: new Date(2020, 0, 2, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerUser.id,
      user_id: customerUser.id,
      date: new Date(2020, 0, 2, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerUser.id,
      user_id: customerUser.id,
      date: new Date(2020, 0, 3, 8, 0, 0),
    });

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 0, 2, 10, 0, 0).getTime();
    });

    const providerAvailability = await listProviderMonthAvailability.execute({
      provider_id: providerUser.id,
      month: 1,
      year: 2020,
    });

    expect(providerAvailability).toEqual(
      expect.arrayContaining([
        { day: 1, available: false },
        { day: 2, available: false },
        { day: 3, available: true },
        { day: 4, available: true },
      ])
    );
  });

  it("should not be able to list the month availability from a non existing provider", async () => {
    await expect(
      listProviderMonthAvailability.execute({
        provider_id: "invalidUserId",
        month: 1,
        year: 2020,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
