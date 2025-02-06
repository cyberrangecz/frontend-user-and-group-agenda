import { ModuleWithProviders, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SentinelTableModule } from '@sentinel/components/table';
import {
  UserAndGroupAgendaConfig,
  UserAndGroupDefaultNavigator,
  UserAndGroupNavigator,
} from '@cyberrangecz-platform/user-and-group-agenda';
import { UserOverviewConcreteService } from '../services/overview/user-overview-concrete.service';
import { UserOverviewService } from '../services/overview/user-overview.service';
import { InternalSharedModule, PaginationService } from '@cyberrangecz-platform/user-and-group-agenda/internal';
import { UserOverviewComponent } from './user-overview.component';
import { UserMaterialModule } from './user-material.module';
import { UserResolverService } from '../services/resolvers/user-resolver.service';
import { UserTitleResolverService } from '../services/resolvers/user-title-resolver.service';
import { UserBreadcrumbResolverService } from '../services/resolvers/user-breadcrumb-resolver.service';
import { FileUploadProgressService } from '../services/file-upload/file-upload-progress.service';
import { UsersUploadDialogComponent } from './upload-dialog/users-upload-dialog.component';
import { ngfModule } from 'angular-file';
import { SentinelControlsComponent } from '@sentinel/components/controls';

/**
 * Module containing declarations and necessary imports for user related components
 */
@NgModule({
  declarations: [UserOverviewComponent, UsersUploadDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    SentinelTableModule,
    UserMaterialModule,
    InternalSharedModule,
    ngfModule,
    SentinelControlsComponent,
  ],
  exports: [UserMaterialModule, UserOverviewComponent],
  providers: [
    UserResolverService,
    UserTitleResolverService,
    UserBreadcrumbResolverService,
    PaginationService,
    FileUploadProgressService,
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
