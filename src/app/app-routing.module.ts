import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from './services/guards/auth-guard.service';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: 'app/components/user/user.module#UserModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'group',
    loadChildren: 'app/components/group/group.module#GroupModule',
    canActivate: [AuthGuard]
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
export class AppRoutingModule {

}
