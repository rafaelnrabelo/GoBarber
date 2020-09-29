import { startOfHour, isBefore, getHours } from "date-fns";
import { injectable, inject } from "tsyringe";

import Appointment from "../infra/typeorm/entities/Appointment";

import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";

import AppError from "@shared/errors/AppError";

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const providerUser = await this.usersRepository.findById(provider_id);
    const customerUser = await this.usersRepository.findById(provider_id);

    if (!providerUser || !customerUser) {
      throw new AppError("Provider or Customer not found.");
    }

    if (provider_id === user_id) {
      throw new AppError("Provider and Customer cannot be the same.");
    }

    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("Cannot create an appointment on a past date.");
    }

    const appointmentHour = getHours(appointmentDate);

    if (appointmentHour < 8 || appointmentHour > 17) {
      throw new AppError(
        "Cannot create an appointment before 8m or after 5pm."
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate
    );

    if (findAppointmentInSameDate) {
      throw new AppError("This appointment is already booked.");
    }

    const appointment = await this.appointmentsRepository.create({
      user_id,
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
