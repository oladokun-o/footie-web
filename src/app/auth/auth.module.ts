import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';
import { AuthComponentsModule } from './components/components.module';
import { AuthLayoutModule } from './layout/layout.module';

@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    RouterModule,
    AuthComponentsModule,
    AuthLayoutModule,
  ],
  exports: [
    AuthLayoutModule,
  ]
})
export class AuthModule { }
