import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KypoUserAndGroupApiModule } from '@kypo/user-and-group-api';
import { agendaConfig, apiConfig } from '../../config';
import { SharedProvidersModule } from '../shared-providers.module';
import { GroupOverviewRoutingModule } from './group-overview-routing.module';
import { GroupOverviewComponentsModule } from '@kypo/user-and-group-agenda/group-overview';

@NgModule({
  imports: [
    CommonModule,
    SharedProvidersModule,
    GroupOverviewRoutingModule,
    GroupOverviewComponentsModule.forRoot(agendaConfig),
    KypoUserAndGroupApiModule.forRoot(apiConfig),
  ],
})
export class GroupOverviewModule {}
