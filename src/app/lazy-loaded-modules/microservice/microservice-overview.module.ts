import { MicroserviceOverviewComponentsModule } from './../../../../projects/kypo-user-and-group-agenda/microservice-overview/src/components/microservice-overview-components.module';
import { MicroserviceOverviewRoutingModule } from './microservice-overview-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KypoUserAndGroupApiModule } from '@kypo/user-and-group-api';
import { agendaConfig, apiConfig } from '../../config';
import { SharedProvidersModule } from '../shared-providers.module';

@NgModule({
  imports: [
    CommonModule,
    SharedProvidersModule,
    MicroserviceOverviewRoutingModule,
    MicroserviceOverviewComponentsModule.forRoot(agendaConfig),
    KypoUserAndGroupApiModule.forRoot(apiConfig),
  ],
})
export class MicroserviceOverviewModule {}
