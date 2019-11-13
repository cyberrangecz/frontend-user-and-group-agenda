import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminOverviewComponent} from './admin-overview.component';
import {MicroserviceOverviewComponent} from '../../../projects/user-and-group-management/src/lib/components/microservice/microservice-overview.component';
import {GroupOverviewComponent, UserManagementComponent} from '../../../projects/user-and-group-management/src/public_api';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'a',
    pathMatch: 'full'
  },
  {
    path: 'group/new',
    loadChildren: () => import('app/admin/group-detail.module').then(m => m.GroupDetailModule),
  },
  {
    path: 'group/:groupId/edit',
    loadChildren: () => import('app/admin/group-detail.module').then(m => m.GroupDetailModule),
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
        path: 'microservices',
        component: MicroserviceOverviewComponent,
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
