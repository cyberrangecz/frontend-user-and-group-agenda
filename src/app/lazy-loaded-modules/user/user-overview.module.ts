import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KypoUserAndGroupApiModule } from '@cyberrangecz-platform/user-and-group-api';
import { agendaConfig, apiConfig } from '../../config';
import { SharedProvidersModule } from '../shared-providers.module';
import { UserOverviewRoutingModule } from './user-overview-routing.module';
import { UserComponentsModule } from '@cyberrangecz-platform/user-and-group-agenda/user-overview';

@NgModule({
    imports: [
        CommonModule,
        SharedProvidersModule,
        UserOverviewRoutingModule,
        UserComponentsModule.forRoot(agendaConfig),
        KypoUserAndGroupApiModule.forRoot(apiConfig),
    ],
})
export class UserOverviewModule {
}
