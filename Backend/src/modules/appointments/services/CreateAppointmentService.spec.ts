import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import FakeNotificationsRepository from "@modules/notifications/repositories/fakes/FakeNotificationsRepository";

import CreateAppointmentService from "./CreateAppointmentService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe("CreateAppointment", () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeUsersRepository,
      fakeNotificationsRepository
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

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 0, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 0, 10, 13),
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

    jest.spyOn(Date, "now").mockImplementation(() => {
      return new Date(2020, 0, 10, 10).getTime();
    });

    const appointmentDate = new Date(2020, 0, 10, 13);

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

  it("should not be able to create an appointment on a past date", async () => {
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

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 0, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 10, 11),
        provider_id: providerUser.id,
        user_id: customerUser.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment before 8am or after 5pm", async () => {
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

    jest.spyOn(Date, "now").mockImplementation(() => {
      return new Date(2020, 0, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 11, 7),
        provider_id: providerUser.id,
        user_id: customerUser.id,
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 11, 18),
        provider_id: providerUser.id,
        user_id: customerUser.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment with a non existing provider or customer", async () => {
    await expect(
      createAppointment.execute({
        date: new Date(),
        provider_id: "invalidProviderId",
        user_id: "invalidCustomerId",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment with provider and customer been the same", async () => {
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
