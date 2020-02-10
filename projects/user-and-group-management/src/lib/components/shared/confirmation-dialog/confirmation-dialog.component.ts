import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ConfirmationDialogInput} from './confirmation-dialog.input';
import {DialogResultEnum} from '../../../model/enums/dialog-result.enum';

/**
 * Component displaying confirmation dialog in popup window
 */
@Component({
  selector: 'kypo2-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogInput,
              public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {
  }

  ngOnInit() {
  }

  /**
   * Closes the dialog with SUCCESS result
   */
  confirm() {
    this.dialogRef.close(DialogResultEnum.SUCCESS);
  }

  /**
   * Closes the dialog with CANCELLED result
   */
  cancel() {
    this.dialogRef.close(DialogResultEnum.CANCELLED);
  }
}
