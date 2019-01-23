import {Injectable} from '@angular/core';
import {Alert} from '../../model/alert/alert.model';
import {MatSnackBar} from '@angular/material';
import {AlertComponent} from '../../components/alert/alert.component';
import {Queue} from 'typescript-collections';
import {AlertParameters} from '../../model/alert/alert-parameters';

@Injectable()
export class AlertService {

  private _alertQueue: Queue<Alert> = new Queue<Alert>();

  constructor(public snackBar: MatSnackBar) {
  }

  addAlert(alert: Alert, alertParams: AlertParameters = null) {
    this._alertQueue.enqueue(alert);
    if (this._alertQueue.size() === 1) {
      this.displayAlert();
    }
  }

  private displayAlert() {
    const alert = this._alertQueue.peek();
    const snackBarRef = this.snackBar.openFromComponent(AlertComponent, {
      data: alert,
      duration: 2500
    });

    snackBarRef.afterDismissed()
      .subscribe(() => {
        this._alertQueue.dequeue();
      if (!this._alertQueue.isEmpty()) {
        this.displayAlert();
      }
    });
  }
}
