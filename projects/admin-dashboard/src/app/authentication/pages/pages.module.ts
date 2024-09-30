import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './login/login.component';
import { AdminResetPasswordComponent } from './reset-password/reset-password.component';
import { SharedComponentsModule } from 'projects/admin-dashboard/src/shared/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AdminLoginComponent,
    AdminResetPasswordComponent,
    AdminForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class AuthenticationPagesModule { }
