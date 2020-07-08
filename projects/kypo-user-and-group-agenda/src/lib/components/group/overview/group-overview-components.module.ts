import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SentinelControlsModule } from '@sentinel/components/controls';
import { SentinelTableModule } from '@sentinel/components/table';
import { UserAndGroupAgendaConfig } from '../../../model/client/user-and-group-agenda-config';
import { UserAndGroupDefaultNavigator } from '../../../services/client/user-and-group-default-navigator.service';
import { UserAndGroupNavigator } from '../../../services/client/user-and-group-navigator.service';
import { GroupOverviewConcreteService } from '../../../services/group/overview/group-overview.concrete.service';
import { GroupOverviewService } from '../../../services/group/overview/group-overview.service';
import { GroupBreadcrumbResolver } from '../../../services/resolvers/group/breadcrumb/group-breadcrumb-resolver.service';
import { GroupResolver } from '../../../services/resolvers/group/group-resolver.service';
import { GroupTitleResolver } from '../../../services/resolvers/group/title/group-title-resolver.service';
import { InternalSharedModule } from '../../shared/internal-shared.module';
import { GroupOverviewMaterialModule } from './group-overview-material.module';
import { GroupOverviewComponent } from './group-overview.component';

/**
 * Module containing components and necessary imports for group overview page
 */
@NgModule({
  imports: [
    CommonModule,
    InternalSharedModule,
    GroupOverviewMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SentinelTableModule,
    SentinelControlsModule,
  ],
  declarations: [GroupOverviewComponent],
  providers: [
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
