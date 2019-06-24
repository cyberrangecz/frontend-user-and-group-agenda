import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ConfirmationDialogInputModel} from './confirmation-dialog-input.model';
import {DialogResultEnum} from '../../../model/enums/dialog-result.enum';

@Component({
  selector: 'kypo2-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogInputModel,
              public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {
  }

  ngOnInit() {
  }

  confirm() {
    this.dialogRef.close(DialogResultEnum.SUCCESS);
  }

  cancel() {
    this.dialogRef.close(DialogResultEnum.CANCELED);
  }
}
