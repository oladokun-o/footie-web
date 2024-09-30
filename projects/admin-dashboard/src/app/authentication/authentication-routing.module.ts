import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from 'projects/admin-dashboard/src/app/authentication/authentication.component';
import { AdminLoginComponent } from 'projects/admin-dashboard/src/app/authentication/pages/login/login.component';
import { AdminForgotPasswordComponent } from 'projects/admin-dashboard/src/app/authentication/pages/forgot-password/forgot-password.component';
import { AdminResetPasswordComponent } from 'projects/admin-dashboard/src/app/authentication/pages/reset-password/reset-password.component';
import { AdminLogoutComponent } from 'projects/admin-dashboard/src/app/authentication/pages/logout/logout.component';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      {
        path: 'login',
        component: AdminLoginComponent
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'logout',
        component: AdminLogoutComponent
      },
      {
        path: 'forgot-password',
        component: AdminForgotPasswordComponent
      },
      {
        path: 'reset-password/:token',
        component: AdminResetPasswordComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
