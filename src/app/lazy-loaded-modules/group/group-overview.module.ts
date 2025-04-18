import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserAndGroupApiModule } from '@crczp/user-and-group-api';
import { agendaConfig, apiConfig } from '../../config';
import { SharedProvidersModule } from '../shared-providers.module';
import { GroupOverviewRoutingModule } from './group-overview-routing.module';
import { GroupOverviewComponentsModule } from '@crczp/user-and-group-agenda/group-overview';

@NgModule({
    imports: [
        CommonModule,
        SharedProvidersModule,
        GroupOverviewRoutingModule,
        GroupOverviewComponentsModule.forRoot(agendaConfig),
        UserAndGroupApiModule.forRoot(apiConfig),
    ],
})
export class GroupOverviewModule {
}
