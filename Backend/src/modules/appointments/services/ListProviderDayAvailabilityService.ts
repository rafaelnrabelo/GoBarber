import { injectable, inject } from "tsyringe";
import { getHours, isAfter } from "date-fns";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";

import AppError from "@shared/errors/AppError";

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
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
  }: IRequest): Promise<IResponse> {
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

    const eachHourArray = Array.from({ length: 10 }, (_, index) => index + 8);
    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map((hour) => {
      const appointmentInHour = appointments.find(
        (appointment) => getHours(appointment.date) === hour
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !appointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
