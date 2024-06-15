import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateUserDto } from 'src/app/core/dto/user.dto';
import { User } from 'src/app/core/interfaces/user.interface';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'footiedrop-web-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent {

  get userData(): { email: string, userId: string } { return JSON.parse(localStorage.getItem('userSessionData') as string); }
  shouldResendOTP: boolean = false;
  isSettings: boolean = false;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    if (this.userData) {
      this.checkIfUserIsVerified();
    } else {
      this.router.navigate(['/login']);
    };

    route.queryParams.subscribe(data => {
      if (data['resendOTP'] && data['resendOTP'] === 'true') {
        window.history.replaceState({}, document.title, window.location.pathname);
        this.shouldResendOTP = true;
        this.resendVerificationEmail();
      }
    });

    route.data.subscribe(data => {
      if (data['settings']) {
        this.isSettings = true;
      }
    });

    this.form.valueChanges.subscribe(val => {
      let otp = val.otp.replace(/\D/g, '');
      if (otp && otp.length === 4) {
        this.verify();
      }
    });
  }

  form: FormGroup = new FormGroup({
    email: new FormControl(this.userData ? this.userData.email : null, [Validators.required, Validators.email]),
    otp: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
  });
  loading = false;

  checkIfUserIsVerified() {
    this.userService.getUserByEmailForVerification(this.userData.email).subscribe(
      (response) => {
        const user: User = response;
        if (user.settings.verified) {
          this.toastr.success('Account is already verified');
          if (this.isLoggedIn) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/login']);
          }
        }
      },
      (error) => {
        this.toastr.error(error);
      }
    );
  }

  verify() {
    if (this.form.invalid) {
      return;
    } else {
      const payload = { ...this.form.value, otp: this.form.value.otp.replace(/\D/g, '') };
      this.loading = true;
      this.userService.verifyOTP(payload).subscribe(
        (response) => {
          this.loading = false;
          this.toastr.success('OTP verified successfully');
          if (!this.shouldResendOTP) {
            if (this.isLoggedIn) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/login']);
            }
          }
        },
        (error) => {
          if (Array.isArray(error.message)) {
            error.message.forEach((err: string) => {
              this.toastr.error(err);
            });
          } else {
            this.toastr.error(error);
          };
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
  resendOTP() {
    this.resending = true;
    this.userService.resendOtp(this.userData.email).subscribe(
      (response) => {
        this.toastr.success('OTP has been resent successfully');
        this.resending = false;
      },
      (error) => {
        this.toastr.error(error);
        this.resending = false;
      }
    );
  }

  resendingEmail: boolean = false;
  resendVerificationEmail(): void {
    this.resendingEmail = true;
    this.toastr.info('Sending verification email, please wait', '', { disableTimeOut: true });
    this.userService.resendOtp(this.userData.email).subscribe(
      response => {
        this.toastr.clear();
        this.resendingEmail = false;
        if (response) {
          setTimeout(() => {
            this.toastr.success('Verification email sent successfully');
          }, 500);
        }
      },
      error => {
        this.resendingEmail = false;
        this.toastr.error('Failed to send verification email');
      }
    );
  }

}
