import { NgModule } from '@angular/core';
import {
  UserAndGroupErrorHandler,
  UserAndGroupNotificationService,
} from '../../../projects/user-and-group-management/src/public_api';
import { ClientErrorHandlerService } from '../services/client-error-handler.service';
import { ClientNotificationService } from '../services/client-notification.service';

@NgModule({
  providers: [
    { provide: UserAndGroupErrorHandler, useClass: ClientErrorHandlerService },
    { provide: UserAndGroupNotificationService, useClass: ClientNotificationService },
  ],
})
export class SharedProvidersModule {}
