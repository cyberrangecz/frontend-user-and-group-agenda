import {Injectable} from '@angular/core';
import {Kypo2UserAndGroupNotification} from '../../model/events/kypo2-user-and-group-notification';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class Kypo2UserAndGroupNotificationService {

  private notificationSubject: Subject<Kypo2UserAndGroupNotification> = new Subject<Kypo2UserAndGroupNotification>();
  notification$: Observable<Kypo2UserAndGroupNotification> = this.notificationSubject.asObservable();

  notify(notification: Kypo2UserAndGroupNotification) {
    this.notificationSubject.next(notification);
  }
}
