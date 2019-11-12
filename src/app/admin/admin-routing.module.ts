import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminOverviewComponent} from './admin-overview.component';
import {UserManagementComponent} from '../../../projects/user-and-group-management/src/lib/components/user/user-management/user-management.component';
import {GroupOverviewComponent} from '../../../projects/user-and-group-management/src/lib/components/group/group-management/group-overview.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'a',
    pathMatch: 'full'
  },
  {
    path: 'a',
    component: AdminOverviewComponent,
    children: [
      {
        path: 'user',
        component: UserManagementComponent,
        outlet: 'tab'
      },
      {
        path: 'group',
        component: GroupOverviewComponent,
        outlet: 'tab'
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'user',
        outlet: 'tab'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ADMIN_ROUTES)],
  exports: [RouterModule]
})
export class AdminRoutingModule {

}
