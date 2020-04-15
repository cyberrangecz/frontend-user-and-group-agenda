/**
 * Service emitting notification from user and group library
 */
export abstract class UserAndGroupNotificationService {

  /**
   * Emits notification
   * @param type type of notification
   * @param message message of notification
   * @param duration optional duration of the notification
   */
  abstract emit(
    type: 'error' | 'warning' | 'info' | 'success',
    message: string,
    duration?: number): void;
}
