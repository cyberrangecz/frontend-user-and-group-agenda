import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material';
import {Alert} from '../../model/alert.model';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  public snackBarRef: MatSnackBarRef<AlertComponent>;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public alert: Alert) { }

  ngOnInit() {
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
