import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Kypo2GroupEditComponentsModule} from './kypo2-group-edit-components.module';
import {GroupEditService} from '../../../services/group/group-edit.service';
import {GroupEditConcreteService} from '../../../services/group/group-edit-concrete.service';
import {RoleAssignService} from '../../../services/role/role-assign.service';
import {RoleAssignConcreteService} from '../../../services/role/role-assign-concrete.service';
import {UserAssignService} from '../../../services/user/user-assign.service';
import {UserAssignConcreteService} from '../../../services/user/user-assign-concrete.service';

@NgModule({
  imports: [
    CommonModule,
    Kypo2GroupEditComponentsModule
  ],
  providers: [
    { provide: GroupEditService, useClass: GroupEditConcreteService },
    { provide: RoleAssignService, useClass: RoleAssignConcreteService },
    { provide: UserAssignService, useClass: UserAssignConcreteService }
  ]
})
export class Kypo2GroupEditModule {

}
