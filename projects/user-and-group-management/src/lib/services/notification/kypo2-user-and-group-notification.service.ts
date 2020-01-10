import {Injectable} from '@angular/core';
import {Kypo2UserAndGroupNotification} from '../../model/events/kypo2-user-and-group-notification';
import {Observable, Subject} from 'rxjs';

/**
 * Service emitting notification from user and group library. Client must subscribe to notification$ observable and handle notifications
 */
@Injectable()
export class Kypo2UserAndGroupNotificationService {

  private notificationSubject: Subject<Kypo2UserAndGroupNotification> = new Subject<Kypo2UserAndGroupNotification>();

  /**
   * Subscribe to receive notifications emitted from user and group library
   */
  notification$: Observable<Kypo2UserAndGroupNotification> = this.notificationSubject.asObservable();

  /**
   * Emit new notification to all observers
   * @param notification notification to emit
   */
  notify(notification: Kypo2UserAndGroupNotification) {
    this.notificationSubject.next(notification);
  }
}
