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
    this.alertQueue.length > 0 ? this.alertQueue.push(alert) : this.displayAlert(alert);
  }

  private displayAlert(alert: Alert) {
    const snackBarRef = this.snackBar.openFromComponent(AlertComponent, {
      data: alert
    });

    snackBarRef.afterDismissed().subscribe(() => {
      if (this.alertQueue.length > 0) {
        this.displayAlert(this.getAlertFromQueue());
      }
    });
  }

  private getAlertFromQueue(): Alert {
    // TODO
    return null;
  }
}

