import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertService} from '../../services/alert/alert.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatButtonModule, MatDialogModule, MatIconModule} from '@angular/material';
import {AlertComponent} from './alert/alert.component';
import {ErrorHandlerService} from '../../services/alert/error-handler.service';

@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    AlertComponent,

  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  providers: [
    AlertService,
    ErrorHandlerService
  ],
  exports: [
    ConfirmationDialogComponent
  ],
  entryComponents: [
    AlertComponent,
    ConfirmationDialogComponent
  ]
})
export class SharedModule { }
