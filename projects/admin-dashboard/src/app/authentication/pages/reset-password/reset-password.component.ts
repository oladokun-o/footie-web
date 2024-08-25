import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'footiedrop-web-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetToken: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    // private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {
    toastr.toastrConfig.preventDuplicates = true;
    this.activatedRoute.params.subscribe(params => {
      this.resetToken = params['token'];
      this.verifyToken();
      this.setForm();
    });
  }

  verifyToken() {
    // this.userService.verifyResetPasswordToken(this.resetToken).subscribe(
    //   res => {
    //     const data: { valid: true } = res.data;
    //     if (!data.valid) {
    //       this.toastr.error('Invalid token');
    //       if (this.isLoggedIn) {
    //         this.router.navigate(['/dashboard']);
    //       } else {
    //         this.router.navigate(['/login']);
    //       }
    //     }
    //   },
    //   err => {
    //     this.toastr.error('Reset password token expired');
    //     this.router.navigate(['/login']);
    //   }
    // );
  }

  get isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  form!: FormGroup;

  setForm() {
    this.form = new FormGroup({
      password: new FormControl('', [Validators.required]),
      token: new FormControl(this.resetToken)
    });
  }

  loading: boolean = false;

  submit() {
    if (this.form.valid) {
      this.loading = true;
      // this.userService.updatePassword(this.form.value).subscribe(
      //   res => {
      //     this.toastr.success(res.message);
      //     this.router.navigate(['/login']);
      //   },
      //   err => {
      //     this.toastr.error(err.error.message);
      //     this.loading = false;
      //   }
      // );
    }
  }
}
