import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material';
import {Kypo2UserAndGroupNotification} from '../../../../projects/user-and-group-management/src/lib/model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../../../projects/user-and-group-management/src/lib/model/enums/kypo2-user-and-group-notification-type.enum';

@Component({
  selector: 'kypo2-alert',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  alertTypeEnums = Kypo2UserAndGroupNotificationType;
  messages: string[];

  constructor(public snackBarRef: MatSnackBarRef<NotificationComponent>,
              @Inject(MAT_SNACK_BAR_DATA) public alert: Kypo2UserAndGroupNotification) { }

  ngOnInit() {
    this.messages = this.alert.message.split('\n');
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
