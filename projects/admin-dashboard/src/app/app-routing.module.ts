import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('projects/admin-dashboard/src/app/authentication/authentication.module').then(m => m.AdminAuthenticationModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('projects/admin-dashboard/src/app/dashboard/dashboard.module').then(m => m.AdminDashboardModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
