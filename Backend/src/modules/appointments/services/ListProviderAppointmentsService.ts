import { injectable, inject } from "tsyringe";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";

import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";

import AppError from "@shared/errors/AppError";

interface IRequest {
  provider_id: string;
  day: number;
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const user = await this.usersRepository.findById(provider_id);

    if (!user) {
      throw new AppError("User not found.");
    }

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      }
    );

    return appointments;
  }
}

export default ListProviderAppointmentsService;
