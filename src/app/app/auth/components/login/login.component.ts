import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'footiedrop-web-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginmode: 'email' | 'phone' = JSON.parse(sessionStorage.getItem('loginmode') as string) || 'email';
  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    role: new FormControl("customer"),
  });
  loggingIn = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    // check the login mode
    this.checkLoginMode();
  }

  toggleLoginMode() {
    this.loginmode = this.loginmode === 'email' ? 'phone' : 'email';
    sessionStorage.setItem('loginmode', JSON.stringify(this.loginmode));
    // check the login mode
    this.checkLoginMode();
    // reset the form
    this.form.reset();
  }

  checkLoginMode() {
    // change the form controls based on the login mode
    if (this.loginmode === 'email') {
      this.form.controls["email"].setValidators([Validators.required, Validators.email]);
      this.form.controls["phone"].clearValidators();
    } else {
      this.form.controls["phone"].setValidators([Validators.required]);
      this.form.controls["email"].clearValidators();
    };
  }

  login() {
    if (this.form.invalid) {
      return;
    } else {
      const { email, password, phone, role } = this.form.value;
      this.loggingIn = true;
      if (this.loginmode === 'email') {
        this.authService.loginByEmail({
          email: email,
          password: password,
          role: role
        }).subscribe(
          response => {
            this.loggingIn = false;
            this.toastr.success('Sign In Successful!');
            this.router.navigate(['/dashboard']);
          },
          error => {
            this.loggingIn = false;
            this.toastr.error(error);
          }
        )
      } else {
        console.log(role)
        this.authService.loginByPhone({
          phone: phone,
          password: password,
          role: role
        }).subscribe(
          response => {
            this.loggingIn = false;
            this.toastr.success(response.message);
            this.router.navigate(['/dashboard']);
          },
          error => {
            this.loggingIn = false;
            this.toastr.error(error);
          }
        )
      }
    }
  }

  loginWithGoogle() {

  }
}
