import {ModuleWithProviders, NgModule} from '@angular/core';
import {GroupOverviewComponent} from './group-overview.component';
import {CommonModule} from '@angular/common';
import {InternalSharedModule} from '../../shared/internal-shared.module';
import {GroupOverviewMaterialModule} from './group-overview-material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Kypo2TableModule} from 'kypo2-table';
import {KypoControlsModule} from 'kypo-controls';
import {UserApi} from '../../../services/api/user/user-api.service';
import {UserDefaultApi} from '../../../services/api/user/user-default-api.service';
import {RoleApi} from '../../../services/api/role/role-api.service';
import {RoleDefaultApi} from '../../../services/api/role/role-default-api.service';
import {GroupApi} from '../../../services/api/group/group-api.service';
import {GroupDefaultApi} from '../../../services/api/group/group-default-api.service';
import {GroupOverviewService} from '../../../services/group/group-overview.service';
import {GroupOverviewConcreteService} from '../../../services/group/group-overview.concrete.service';
import {UserAndGroupConfig} from '../../../model/client/user-and-group-config';
import {UserAndGroupNavigator} from '../../../services/client/user-and-group-navigator.service';
import {UserAndGroupDefaultNavigator} from '../../../services/client/user-and-group-default-navigator.service';
import {GroupResolver} from '../../../services/resolvers/group-resolver.service';
import {GroupTitleResolver} from '../../../services/resolvers/group-title-resolver.service';
import {GroupBreadcrumbResolver} from '../../../services/resolvers/group-breadcrumb-resolver.service';

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
        Kypo2TableModule,
        KypoControlsModule,
    ],
  declarations: [
    GroupOverviewComponent,
  ],
  providers: [
    GroupResolver,
    GroupTitleResolver,
    GroupBreadcrumbResolver,
    { provide: UserApi, useClass: UserDefaultApi },
    { provide: RoleApi, useClass: RoleDefaultApi },
    { provide: GroupApi, useClass: GroupDefaultApi },
    { provide: GroupOverviewService, useClass: GroupOverviewConcreteService },
    { provide: UserAndGroupNavigator, useClass: UserAndGroupDefaultNavigator}
  ],
  exports: [
    GroupOverviewMaterialModule,
    GroupOverviewComponent,
  ]
})
export class GroupOverviewComponentsModule {
  static forRoot(config: UserAndGroupConfig): ModuleWithProviders<GroupOverviewComponentsModule> {
    return {
      ngModule: GroupOverviewComponentsModule,
      providers: [
        {provide: UserAndGroupConfig, useValue: config}
      ]
    };
  }
}
