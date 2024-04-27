import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/interfaces/user.interface';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'footiedrop-web-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });
  loading = false;

  canResend: boolean = false;

  reset() {
    if (this.form.invalid) {
      return;
    } else {
      const payload = this.form.value;
      this.loading = true;
      this.userService.resetPassword(payload).subscribe(
        (response) => {
          this.toastr.success(response.message);
          this.canResend = true;
          this.loading = false;
        },
        (error) => {
          this.toastr.error(error);
          this.loading = false;
        }
      );
    }
  }

  get isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  truncateEmailAddress(email: string) {
    const [username, domain] = email.split('@');
    const usernameTruncated = username.slice(0, 2) + '*'.repeat(username.length - 4) + username.slice(-2);
    return `${usernameTruncated}@${domain}`;
  }

  resending: boolean = false;
  resend() {
    this.resending = true;
    this.userService.resetPassword(this.form.value).subscribe(
      (response: any) => {
        this.toastr.success(response.message);
        this.resending = false;
      },
      (error: any) => {
        this.toastr.error(error.message);
        this.resending = false;
      }
    );
  }
}
