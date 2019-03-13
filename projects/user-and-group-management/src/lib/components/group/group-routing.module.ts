import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GroupManagementComponent} from './group-management/group-management.component';

const routes: Routes = [
  {
   path: '',
   component: GroupManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule {

}
