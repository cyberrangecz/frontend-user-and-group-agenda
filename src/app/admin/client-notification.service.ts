import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Queue} from 'typescript-collections';
import {Kypo2UserAndGroupNotification} from '../../../projects/user-and-group-management/src/lib/model/events/kypo2-user-and-group-notification';
import {NotificationComponent} from './notification/notification.component';

/**
 * Example service handling notifications emitted from user and group
 */
@Injectable()
export class ClientNotificationService {

  private _notificationQueue: Queue<Kypo2UserAndGroupNotification> = new Queue<Kypo2UserAndGroupNotification>();

  constructor(public snackBar: MatSnackBar) {
  }

  /**
   * Adds new notification to queue when emitted from user and group library
   * @param notification notification emitted from user and group library
   */
  addNotification(notification: Kypo2UserAndGroupNotification) {
    this._notificationQueue.enqueue(notification);
    if (this._notificationQueue.size() === 1) {
      this.displayNotification();
    }
  }

  private displayNotification() {
    const notification = this._notificationQueue.peek();
    const snackBarRef = this.snackBar.openFromComponent(NotificationComponent, {
      data: notification,
      duration: 2500
    });

    snackBarRef.afterDismissed()
      .subscribe(() => {
        this._notificationQueue.dequeue();
        if (!this._notificationQueue.isEmpty()) {
          this.displayNotification();
        }
      });
  }
}
