import {NotificationType} from '../enums/alert-type.enum';

export class Notification {
  type: NotificationType;
  message: string;

  constructor(type: NotificationType, message: string) {
    this.type = type;
    this.message = message;
  }
}
