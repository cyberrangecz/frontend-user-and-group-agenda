import {
    MicroserviceOverviewComponentsModule
} from '../../../../projects/user-and-group-agenda/microservice-overview/src/components/microservice-overview-components.module';
import { MicroserviceOverviewRoutingModule } from './microservice-overview-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserAndGroupApiModule } from '@crczp/user-and-group-api';
import { agendaConfig, apiConfig } from '../../config';
import { SharedProvidersModule } from '../shared-providers.module';

@NgModule({
    imports: [
        CommonModule,
        SharedProvidersModule,
        MicroserviceOverviewRoutingModule,
        MicroserviceOverviewComponentsModule.forRoot(agendaConfig),
        UserAndGroupApiModule.forRoot(apiConfig),
    ],
})
export class MicroserviceOverviewModule {
}
