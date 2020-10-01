import { ObjectID } from "mongodb";

import Notification from "../../infra/typeorm/schemas/Notification";

import INotificationsRepository from "../INotificationsRepository";
import ICreateNotificationDTO from "../../dtos/ICreateNotificationDTO";

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, {
      id: new ObjectID(),
      content,
      recipient_id,
    });

    this.notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationsRepository;
