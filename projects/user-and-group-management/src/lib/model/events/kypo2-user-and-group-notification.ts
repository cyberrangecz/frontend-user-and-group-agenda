import {Kypo2UserAndGroupNotificationType} from '../enums/kypo2-user-and-group-notification-type.enum';

/**
 * Notification event
 */
export class Kypo2UserAndGroupNotification {
  type: Kypo2UserAndGroupNotificationType;
  message: string;

  constructor(type: Kypo2UserAndGroupNotificationType, message: string) {
    this.type = type;
    this.message = message;
  }
}
