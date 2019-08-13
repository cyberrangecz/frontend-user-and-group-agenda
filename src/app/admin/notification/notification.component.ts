import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material';
import {Notification} from '../../../../projects/user-and-group-management/src/lib/model/alert/alert.model';
import {NotificationType} from '../../../../projects/user-and-group-management/src/lib/model/enums/alert-type.enum';

@Component({
  selector: 'kypo2-alert',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  alertTypeEnums = NotificationType;
  messages: string[];

  constructor(public snackBarRef: MatSnackBarRef<NotificationComponent>,
              @Inject(MAT_SNACK_BAR_DATA) public alert: Notification) { }

  ngOnInit() {
    this.messages = this.alert.message.split('\n');
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
