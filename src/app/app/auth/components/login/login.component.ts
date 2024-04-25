import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'footiedrop-web-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginmode: 'email' | 'phone' = 'email';
  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
  });
  loggingIn = false;

  constructor(
    private authService: AuthService,
  ) {
    this.form.controls["email"].setValidators([Validators.required, Validators.email]);
    this.form.controls["phone"].clearValidators();
  }

  toggleLoginMode() {
    this.loginmode = this.loginmode === 'email' ? 'phone' : 'email';
    // change the form controls based on the login mode
    if (this.loginmode === 'email') {
      this.form.controls["email"].setValidators([Validators.required, Validators.email]);
      this.form.controls["phone"].clearValidators();
    } else {
      this.form.controls["phone"].setValidators([Validators.required]);
      this.form.controls["email"].clearValidators();
    };
    // reset the form
    this.form.reset();
  }

  login() {
    if (this.form.invalid) {
      return;
    } else {
      const { email, password, phone } = this.form.value;
      this.loggingIn = true;
      if (this.loginmode === 'email') {

      } else {

      }
    }
  }

  loginWithGoogle() {

  }
}
