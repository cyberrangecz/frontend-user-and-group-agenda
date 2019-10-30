import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Queue} from 'typescript-collections';
import {Kypo2UserAndGroupNotification} from '../../../projects/user-and-group-management/src/lib/model/events/kypo2-user-and-group-notification';
import {NotificationComponent} from './notification/notification.component';

@Injectable()
export class ClientNotificationService {

  private _alertQueue: Queue<Kypo2UserAndGroupNotification> = new Queue<Kypo2UserAndGroupNotification>();

  constructor(public snackBar: MatSnackBar) {
  }

  addNotification(alert: Kypo2UserAndGroupNotification) {
    this._alertQueue.enqueue(alert);
    if (this._alertQueue.size() === 1) {
      this.displayNotification();
    }
  }

  private displayNotification() {
    const alert = this._alertQueue.peek();
    const snackBarRef = this.snackBar.openFromComponent(NotificationComponent, {
      data: alert,
      duration: 2500
    });

    snackBarRef.afterDismissed()
      .subscribe(() => {
        this._alertQueue.dequeue();
        if (!this._alertQueue.isEmpty()) {
          this.displayNotification();
        }
      });
  }
}
