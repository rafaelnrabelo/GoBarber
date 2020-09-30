import ICreateNotificationDTO from "../dtos/ICreateNotificationDTO";
import Notification from "../infra/typeorm/schemas/Notification";

interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
}

export default INotificationsRepository;
