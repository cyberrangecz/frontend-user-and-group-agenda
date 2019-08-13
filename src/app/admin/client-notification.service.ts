import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Queue} from 'typescript-collections';
import {Notification} from '../../../projects/user-and-group-management/src/lib/model/alert/alert.model';
import {NotificationComponent} from './notification/notification.component';

@Injectable()
export class ClientNotificationService {

  private _alertQueue: Queue<Notification> = new Queue<Notification>();

  constructor(public snackBar: MatSnackBar) {
  }

  addNotification(alert: Notification) {
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
