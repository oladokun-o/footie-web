import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/interfaces/user.interface';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'footiedrop-web-change-address',
  templateUrl: './change-address.component.html',
  styleUrls: ['./change-address.component.scss'],
})
export class ChangeAddressComponent implements OnInit {
  constructor(
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  form!: FormGroup;

  ngOnInit(): void {
    if (this.user) this.setForm();
  }

  get user(): User {
    return localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null;
  }

  setForm(): void {
    this.form = new FormGroup({
      addressStreet: new FormControl(this.user.addressStreet, Validators.required),
      addressCity: new FormControl(this.user.addressCity, Validators.required),
      addressState: new FormControl(this.user.addressState),
      floor: new FormControl(this.user.floor),
      apartment_number: new FormControl(this.user.apartment_number),
      zip_code: new FormControl(this.user.zip_code),
      addressPostalCode: new FormControl(this.user.addressPostalCode),
      addressCountry: new FormControl(this.user.addressCountry, Validators.required),
    });
  }

  saving: boolean = false;

  save(): void {
    if (this.form.valid) {
      this.saving = true;
      this.settingsService.UpdateAddress(this.form.value).subscribe(
        (res) => {
          // this.router.navigate(['/dashboard/settings']);
          this.saving = false;
          this.toastr.success(res.message);
        },
        (error) => {
          console.log(error);
          this.saving = false;
          if (error && error.message) {
            if (Array.isArray(error.message)) {
              error.message.forEach((err: string) => {
                this.toastr.error(err);
              });
            } else {
              this.toastr.error(error.message);
            }
          } else {
            this.toastr.error(error);
          }
        }
      );
    }
  }
}
