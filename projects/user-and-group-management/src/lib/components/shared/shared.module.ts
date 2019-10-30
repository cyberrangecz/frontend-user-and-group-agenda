import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatButtonModule, MatDialogModule, MatIconModule} from '@angular/material';
import {Kypo2UserAndGroupNotificationService} from '../../services/notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupErrorService} from '../../services/notification/kypo2-user-and-group-error.service';
import {ConfigService} from '../../config/config.service';
import {Kypo2UserAndGroupRoutingEventService} from '../../services/routing/kypo2-user-and-group-routing-event.service';

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
    Kypo2UserAndGroupNotificationService,
    Kypo2UserAndGroupRoutingEventService,
    Kypo2UserAndGroupErrorService,
    ConfigService
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ]
})
export class SharedModule { }
