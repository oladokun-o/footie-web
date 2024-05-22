import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('src/app/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard]
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
