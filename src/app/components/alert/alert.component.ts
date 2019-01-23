import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material';
import {Alert} from '../../model/alert/alert.model';
import {AlertType} from '../../model/enums/alert-type.enum';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  alertTypeEnums = AlertType;

  constructor(public snackBarRef: MatSnackBarRef<AlertComponent>,
              @Inject(MAT_SNACK_BAR_DATA) public alert: Alert) { }

  ngOnInit() {
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
