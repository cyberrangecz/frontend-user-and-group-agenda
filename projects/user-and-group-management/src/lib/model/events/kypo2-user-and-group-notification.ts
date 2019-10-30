import {Kypo2UserAndGroupNotificationType} from '../enums/alert-type.enum';

export class Kypo2UserAndGroupNotification {
  type: Kypo2UserAndGroupNotificationType;
  message: string;

  constructor(type: Kypo2UserAndGroupNotificationType, message: string) {
    this.type = type;
    this.message = message;
  }
}
