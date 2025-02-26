import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserAndGroupApiModule } from '@crczp/user-and-group-api';
import { agendaConfig, apiConfig } from '../../config';
import { SharedProvidersModule } from '../shared-providers.module';
import { UserOverviewRoutingModule } from './user-overview-routing.module';
import { UserComponentsModule } from '@crczp/user-and-group-agenda/user-overview';

@NgModule({
    imports: [
        CommonModule,
        SharedProvidersModule,
        UserOverviewRoutingModule,
        UserComponentsModule.forRoot(agendaConfig),
        UserAndGroupApiModule.forRoot(apiConfig),
    ],
})
export class UserOverviewModule {
}
