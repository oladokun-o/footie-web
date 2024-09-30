import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'admin-app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class AdminLoginComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    role: new FormControl("admin")
  });
  loggingIn = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  login() {
    if (this.form.invalid) {
      return;
    } else {
      const { email, password, role } = this.form.value;
      this.loggingIn = true;
      this.toastr.clear();
      this.authService.loginByEmail({
        email: email,
        password: password,
        role: role
      }).subscribe(
        response => {
          this.loggingIn = false;
          this.toastr.success('Sign In Successful!', '', {
            timeOut: 1000
          });
          this.router.navigate(['/dashboard']);
        },
        error => {
          this.loggingIn = false;
          if (Array.isArray(error.message)) {
            error.message.forEach((err: string) => {
              this.toastr.error(err);
            });
          } else {
            this.toastr.error(error.message);
          };
        }
      )
    }
  }
}
