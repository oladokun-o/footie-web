import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationComponent } from './authentication.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { RouterModule } from '@angular/router';
import { AuthenticationPagesModule } from './pages/pages.module';
import { AuthenticationLayoutModule } from './layout/layout.module';



@NgModule({
  declarations: [
    AuthenticationComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    RouterModule,
    AuthenticationPagesModule,
    AuthenticationLayoutModule
  ],
  exports: [
    AuthenticationLayoutModule
  ]
})
export class AuthenticationModule { }
