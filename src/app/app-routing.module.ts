import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './core/guards/auth.guard';
import { KycGuard, KycRoleGuard } from './core/guards/kyc.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'kyc',
    loadChildren: () => import('src/app/kyc/kyc.module').then((m) => m.KycModule),
    canActivate: [KycRoleGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('src/app/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard, KycGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
