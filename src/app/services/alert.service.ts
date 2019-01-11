import {Injectable} from '@angular/core';
import {Alert} from '../model/alert.model';
import {MatSnackBar} from '@angular/material';
import {AlertComponent} from '../components/alert/alert.component';

@Injectable()
export class AlertService {

  private alertQueue: Alert[] = [];

  constructor(public snackBar: MatSnackBar) {

  }

  addAlert(alert: Alert) {
    this.enqueue(alert);
    if (this.alertQueue.length <= 1) {
      this.displayAlert();
    }
  }

  private displayAlert() {
    const alert = this.dequeue();
    const snackBarRef = this.snackBar.openFromComponent(AlertComponent, {
      data: alert
    });

    snackBarRef.afterDismissed().subscribe(() => {
      if (this.alertQueue.length > 0) {
        this.displayAlert();
      }
    });
  }

  private dequeue(): Alert {
    const result = this.alertQueue[0];
    this.alertQueue = this.alertQueue.splice(0, 1);
    return result;
  }

  private enqueue(alert: Alert) {
    this.alertQueue.push(alert);
  }
}


