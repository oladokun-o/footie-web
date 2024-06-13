import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Languages } from 'src/app/core/interfaces/index.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'footiedrop-web-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {
  constructor(
    private settingsService: SettingsService,
    private toastr: ToastrService
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
      language: new FormControl(
        this.user ? this.user.settings.language : Languages.ENGLISH,
        Validators.required
      ),
    });
  }

  languages: { label: string; value: string }[] = Object.keys(Languages).map(
    (key) => {
      return { label: key, value: Languages[key as keyof typeof Languages] };
    }
  );

  saving: boolean = false;

  save(): void {
    if (this.form.valid) {
      this.saving = true;
      this.settingsService.ChangeLanguage(this.form.value).subscribe(
        (res) => {
          this.saving = false;
          this.toastr.success(res.message);
        },
        (err) => {
          this.saving = false;
          this.toastr.error(err.message);
        }
      );
    }
  }
}
