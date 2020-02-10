import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
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
})
export class InternalSharedModule { }
