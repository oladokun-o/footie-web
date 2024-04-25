import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';
import { RouterModule } from '@angular/router';
import { SharedDirectivesModule } from 'src/shared/directives/directives.module';
import { SharedComponentsModule } from 'src/shared/components/components.module';
import { MatTooltipModule } from '@angular/material/tooltip';

const COMPONENTS = [
  LoginComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    RegisterComponent,
    ForgotPasswordComponent,
    VerifyCodeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedDirectivesModule,
    SharedComponentsModule,
    MatTooltipModule,
  ],
  exports: [
    ...COMPONENTS,
  ]
})
export class AuthComponentsModule { }
