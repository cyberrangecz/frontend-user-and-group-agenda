import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginGuard} from './services/guards/login-guard.service';
import {AuthGuard} from './services/guards/auth-guard.service';
import {LoginComponent} from './components/login/login.component';

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
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '/user',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
