import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatButtonModule, MatDialogModule, MatIconModule} from '@angular/material';
import {ConfigService} from '../../config/config.service';

/**
 * Module containing internally shared (within library) components and providers
 */
@NgModule({
  declarations: [
    ConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  exports: [
    ConfirmationDialogComponent
  ],
  providers: [
    ConfigService
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ]
})
export class InternalSharedModule { }
