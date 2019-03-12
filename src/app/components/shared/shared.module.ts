import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertService} from '../../services/alert/alert.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatButtonModule} from '@angular/material';

@NgModule({
  declarations: [
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  providers: [
    AlertService,
  ],
  exports: [
    ConfirmationDialogComponent
  ]
})
export class SharedModule { }
