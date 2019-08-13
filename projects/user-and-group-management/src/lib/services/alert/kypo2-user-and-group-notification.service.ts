import {Injectable} from '@angular/core';
import {Notification} from '../../model/alert/alert.model';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class Kypo2UserAndGroupNotificationService {

  private notificationSubject: Subject<Notification> = new Subject<Notification>();
  notification$: Observable<Notification> = this.notificationSubject.asObservable();

  addNotification(notification: Notification) {
    this.notificationSubject.next(notification);
  }
}
