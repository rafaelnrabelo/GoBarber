import Notification from "../../infra/typeorm/schemas/Notification";

import INotificationsRepository from "../INotificationsRepository";
import ICreateNotificationDTO from "../../dtos/ICreateNotificationDTO";

class FakeNotificationsRepository implements INotificationsRepository {
  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {}
}

export default FakeNotificationsRepository;
