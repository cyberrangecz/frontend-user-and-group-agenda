import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SentinelTableModule } from '@sentinel/components/table';
import {
  UserAndGroupAgendaConfig,
  UserAndGroupDefaultNavigator,
  UserAndGroupNavigator,
} from '@cyberrangecz-platform/user-and-group-agenda';
import { GroupOverviewConcreteService } from '../services/group-overview.concrete.service';
import { GroupOverviewService } from '../services/group-overview.service';
import { GroupBreadcrumbResolver } from '../services/resolvers/breadcrumb/group-breadcrumb-resolver.service';
import { GroupResolver } from '../services/resolvers/group-resolver.service';
import { GroupTitleResolver } from '../services/resolvers/title/group-title-resolver.service';
import { InternalSharedModule, PaginationService } from '@cyberrangecz-platform/user-and-group-agenda/internal';
import { GroupOverviewMaterialModule } from './group-overview-material.module';
import { GroupOverviewComponent } from './group-overview.component';
import { SentinelControlsComponent } from '@sentinel/components/controls';

/**
 * Module containing components and necessary imports for group-overview overview page
 */
@NgModule({
  imports: [
    CommonModule,
    InternalSharedModule,
    GroupOverviewMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SentinelTableModule,
    SentinelControlsComponent,
  ],
  declarations: [GroupOverviewComponent],
  providers: [
    PaginationService,
    GroupResolver,
    GroupTitleResolver,
    GroupBreadcrumbResolver,
    { provide: GroupOverviewService, useClass: GroupOverviewConcreteService },
    { provide: UserAndGroupNavigator, useClass: UserAndGroupDefaultNavigator },
  ],
  exports: [GroupOverviewMaterialModule, GroupOverviewComponent],
})
export class GroupOverviewComponentsModule {
  static forRoot(config: UserAndGroupAgendaConfig): ModuleWithProviders<GroupOverviewComponentsModule> {
    return {
      ngModule: GroupOverviewComponentsModule,
      providers: [{ provide: UserAndGroupAgendaConfig, useValue: config }],
    };
  }
}
