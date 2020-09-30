import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import FakeAppointmentsRepository from "@modules/appointments/repositories/fakes/FakeAppointmentsRepository";

import ListProviderAppointments from "./ListProviderAppointmentsService";

import AppError from "@shared/errors/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointments;

describe("ListProviderAppointments", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointments(
      fakeUsersRepository,
      fakeAppointmentsRepository
    );
  });

  it("should be able to list the provider appointments of a specific day", async () => {
    const provider = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    const customer = await fakeUsersRepository.create({
      name: "Test2",
      email: "test2@test.com",
      password: "123456",
    });

    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: customer.id,
      date: new Date(2020, 0, 10, 10),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: customer.id,
      date: new Date(2020, 0, 10, 14),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: provider.id,
      day: 10,
      month: 1,
      year: 2020,
    });

    expect(appointments.length).toBe(2);
    expect(appointments).toEqual([appointment1, appointment2]);
  });

  it("should not be able to list the appointments from a non existing provider", async () => {
    await expect(
      listProviderAppointments.execute({
        provider_id: "invalidProviderId",
        day: 10,
        month: 1,
        year: 2020,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
