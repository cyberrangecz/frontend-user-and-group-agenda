import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Kypo2GroupEditComponentsModule} from './kypo2-group-edit-components.module';
import {Kypo2GroupEditService} from '../../../services/group/kypo2-group-edit.service';
import {GroupEditConcreteService} from '../../../services/group/group-edit-concrete.service';
import {Kypo2RoleAssignService} from '../../../services/role/kypo2-role-assign.service';
import {RoleAssignConcreteService} from '../../../services/role/role-assign-concrete.service';
import {Kypo2UserAssignService} from '../../../services/user/kypo2-user-assign.service';
import {UserAssignConcreteService} from '../../../services/user/user-assign-concrete.service';
import {UserAndGroupConfig} from '../../../config/user-and-group-config';
import {GroupEditOverviewComponent} from './group-edit-overview.component';

@NgModule({
  imports: [
    CommonModule,
    Kypo2GroupEditComponentsModule
  ],
  providers: [
    { provide: Kypo2GroupEditService, useClass: GroupEditConcreteService },
    { provide: Kypo2RoleAssignService, useClass: RoleAssignConcreteService },
    { provide: Kypo2UserAssignService, useClass: UserAssignConcreteService }
  ],
  exports: [
    GroupEditOverviewComponent
  ]
})
export class Kypo2GroupEditModule {
  constructor(@Optional() @SkipSelf() parentModule: Kypo2GroupEditModule) {
    if (parentModule) {
      throw new Error(
        'Kypo2GroupEditModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: UserAndGroupConfig): ModuleWithProviders {
    return {
      ngModule: Kypo2GroupEditModule,
      providers: [
        {provide: UserAndGroupConfig, useValue: config}
      ]
    };
  }
}
