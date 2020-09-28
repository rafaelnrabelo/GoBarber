import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";

import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import CreateAppointmentService from "./CreateAppointmentService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let createAppointment: CreateAppointmentService;

describe("CreateAppointment", () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeUsersRepository
    );
  });

  it("should be able to create a new appointment", async () => {
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

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: providerUser.id,
      user_id: customerUser.id,
    });

    expect(appointment).toHaveProperty("id");
    expect(appointment.provider_id).toBe(providerUser.id);
    expect(appointment.user_id).toBe(customerUser.id);
  });

  it("should not be able to create two appointments on the same time", async () => {
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

    const appointmentDate = new Date(2020, 8, 25, 17);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: providerUser.id,
      user_id: customerUser.id,
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: providerUser.id,
        user_id: customerUser.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a appointment with a non existing provider or customer", async () => {
    await expect(
      createAppointment.execute({
        date: new Date(),
        provider_id: "invalidProviderId",
        user_id: "invalidCustomerId",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a appointment with provider and customer been the same", async () => {
    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    await expect(
      createAppointment.execute({
        date: new Date(),
        provider_id: user.id,
        user_id: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
