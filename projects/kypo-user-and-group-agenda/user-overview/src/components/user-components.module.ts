import { ModuleWithProviders, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SentinelControlsModule } from '@sentinel/components/controls';
import { SentinelTableModule } from '@sentinel/components/table';
import {
  UserAndGroupNavigator,
  UserAndGroupDefaultNavigator,
  UserAndGroupAgendaConfig,
} from '@muni-kypo-crp/user-and-group-agenda';
import { UserOverviewConcreteService } from '../services/overview/user-overview-concrete.service';
import { UserOverviewService } from '../services/overview/user-overview.service';
import { InternalSharedModule, PaginationService } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { UserOverviewComponent } from './user-overview.component';
import { UserMaterialModule } from './user-material.module';
import { UserResolverService } from '../services/resolvers/user-resolver.service';
import { UserTitleResolverService } from '../services/resolvers/user-title-resolver.service';
import { UserBreadcrumbResolverService } from '../services/resolvers/user-breadcrumb-resolver.service';

/**
 * Module containing declarations and necessary imports for user related components
 */
@NgModule({
  declarations: [UserOverviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    SentinelTableModule,
    UserMaterialModule,
    InternalSharedModule,
    SentinelControlsModule,
  ],
  exports: [UserMaterialModule, UserOverviewComponent],
  providers: [
    UserResolverService,
    UserTitleResolverService,
    UserBreadcrumbResolverService,
    PaginationService,
    { provide: UserOverviewService, useClass: UserOverviewConcreteService },
    { provide: UserAndGroupNavigator, useClass: UserAndGroupDefaultNavigator },
  ],
})
export class UserComponentsModule {
  static forRoot(config: UserAndGroupAgendaConfig): ModuleWithProviders<UserComponentsModule> {
    return {
      ngModule: UserComponentsModule,
      providers: [{ provide: UserAndGroupAgendaConfig, useValue: config }],
    };
  }
}
