import { NgModule } from '@angular/core';
import { ClientErrorHandlerService } from '../services/client-error-handler.service';
import { ClientNotificationService } from '../services/client-notification.service';
import { UserAndGroupErrorHandler, UserAndGroupNotificationService } from 'kypo-user-and-group-agenda';

@NgModule({
  providers: [
    { provide: UserAndGroupErrorHandler, useClass: ClientErrorHandlerService },
    { provide: UserAndGroupNotificationService, useClass: ClientNotificationService },
  ],
})
export class SharedProvidersModule {}
