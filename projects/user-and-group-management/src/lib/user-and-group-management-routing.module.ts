import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {UserAndGroupManagementComponent} from './user-and-group-management.component';

const routes: Routes = [
  {
    path: '',
    component: UserAndGroupManagementComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAndGroupManagementRoutingModule {

}
