import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {Paths} from './components/shared/paths';
import {GroupManagementComponent} from './components/group/group-management/group-management.component';
import {UserManagementComponent} from './components/user/user-management/user-management.component';

const routes: Routes = [
  {
    path: Paths.USER_PATH,
    component: UserManagementComponent
     //loadChildren: './components/user/user.module#UserModule',
  },
  {
    path: Paths.GROUP_PATH,
    component: GroupManagementComponent
    //loadChildren: './components/group/group.module#GroupModule',
  },
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'user'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class UserAndGroupManagementRoutingModule {

}
