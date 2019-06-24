import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material';
import {Alert} from '../../../model/alert/alert.model';
import {AlertType} from '../../../model/enums/alert-type.enum';

@Component({
  selector: 'kypo2-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  alertTypeEnums = AlertType;
  messages: string[];

  constructor(public snackBarRef: MatSnackBarRef<AlertComponent>,
              @Inject(MAT_SNACK_BAR_DATA) public alert: Alert) { }

  ngOnInit() {
    this.messages = this.alert.message.split('\n');
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
