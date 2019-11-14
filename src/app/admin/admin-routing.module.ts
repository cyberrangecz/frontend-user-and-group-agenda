import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminOverviewComponent} from './admin-overview.component';
import {Kypo2MicroserviceEditOverviewComponent} from '../../../projects/user-and-group-management/src/lib/components/microservice/kypo2-microservice-edit-overview.component';
import {Kypo2GroupOverviewComponent, Kypo2UserOverviewComponent} from '../../../projects/user-and-group-management/src/public_api';

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
        component: Kypo2UserOverviewComponent,
        outlet: 'tab'
      },
      {
        path: 'group',
        component: Kypo2GroupOverviewComponent,
        outlet: 'tab'
      },
      {
        path: 'microservices',
        component: Kypo2MicroserviceEditOverviewComponent,
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
