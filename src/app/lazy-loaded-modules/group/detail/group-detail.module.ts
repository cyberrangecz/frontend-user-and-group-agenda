import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GroupDetailComponentsModule } from '@muni-kypo-crp/user-and-group-agenda/group-detail';
import { agendaConfig } from '../../../config';
import { SharedProvidersModule } from '../../shared-providers.module';
import { GroupDetailRoutingModule } from './group-detail-routing.module';


@NgModule({
  imports: [
    CommonModule,
    SharedProvidersModule,
    GroupDetailRoutingModule,
    GroupDetailComponentsModule.forRoot(agendaConfig),
  ],
})
export class GroupDetailModule {}
