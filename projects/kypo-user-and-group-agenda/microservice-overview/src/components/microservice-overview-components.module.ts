import {
  UserAndGroupContext,
  InternalSharedModule,
  PaginationService,
} from '@muni-kypo-crp/user-and-group-agenda/internal';
import { MicroserviceOverviewConcreteService } from './../services/microservice-overview.concrete.service';
import { SentinelTableModule } from '@sentinel/components/table';
import {
  UserAndGroupAgendaConfig,
  UserAndGroupDefaultNavigator,
  UserAndGroupNavigator,
} from '@muni-kypo-crp/user-and-group-agenda';
import { MicroserviceOverviewMaterialModule } from './microservice-overview-material.module';
import { MicroserviceOverviewComponent } from './microservice-overview.component';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MicroserviceOverviewService } from '../services/microservice-overview.service';
import { SentinelControlsComponent } from '@sentinel/components/controls';

/**
 * Module containing components and necessary imports for microservice-overview page
 */
@NgModule({
  imports: [
    CommonModule,
    SentinelControlsComponent,
    SentinelTableModule,
    InternalSharedModule,
    MicroserviceOverviewMaterialModule,
  ],
  declarations: [MicroserviceOverviewComponent],
  exports: [MicroserviceOverviewMaterialModule, MicroserviceOverviewComponent],
  providers: [
    PaginationService,
    UserAndGroupContext,
    { provide: UserAndGroupNavigator, useClass: UserAndGroupDefaultNavigator },
    { provide: MicroserviceOverviewService, useClass: MicroserviceOverviewConcreteService },
  ],
})
export class MicroserviceOverviewComponentsModule {
  static forRoot(config: UserAndGroupAgendaConfig): ModuleWithProviders<MicroserviceOverviewComponentsModule> {
    return {
      ngModule: MicroserviceOverviewComponentsModule,
      providers: [{ provide: UserAndGroupAgendaConfig, useValue: config }],
    };
  }
}
