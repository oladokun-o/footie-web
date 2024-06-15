import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/interfaces/user.interface';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'footiedrop-web-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  constructor(
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  form!: FormGroup;

  roles: string[] = ['customer', 'courier'];

  public file: File | null = null;
  public fileUrl: string | null = null;
  public fileDropErrorMessage: string = '';
  private maxFileSize = 5242880; // 5MB

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
      file: new FormControl(this.user.profilePicture),
      firstName: new FormControl(this.user.firstName, Validators.required),
      middleName: new FormControl(this.user.middleName),
      lastName: new FormControl(this.user.lastName, Validators.required),
      role: new FormControl(this.user.role),
    });

    this.fileUrl = this.user.profilePicture;

    this.form.valueChanges.subscribe(data => console.log(this.form));
  }

  saving: boolean = false;

  save(): void {
    if (this.form.valid) {
      this.saving = true;
      this.settingsService.UpdateProfile(this.form.value).subscribe(
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

  public dropped(files: NgxFileDropEntry[]) {
    this.handleFileDrop(files);
  }

  public changeFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.handleFile(file);
    }
  }

  private handleFileDrop(files: NgxFileDropEntry[]) {
    this.fileDropErrorMessage = '';

    if (files.length > 0) {
      const droppedFile = files[0];

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.handleFile(file);
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
  }

  private handleFile(file: File) {
    if (this.isFileTypeAccepted(file)) {
      if (this.isFileSizeAccepted(file)) {
        if (this.fileUrl) {
          URL.revokeObjectURL(this.fileUrl);
        }
        this.file = file;
        this.fileUrl = URL.createObjectURL(file);
        this.form.get('file')?.patchValue(file);
        this.form.get('file')?.markAsDirty();
      } else {
        this.fileDropErrorMessage = 'File size exceeds the 5MB limit.';
      }
    } else {
      this.fileDropErrorMessage = 'Only image files (PNG, JPEG) are allowed.';
    }
  }

  private isFileTypeAccepted(file: File): boolean {
    const acceptedTypes = ['image/png', 'image/jpeg'];
    return acceptedTypes.includes(file.type);
  }

  private isFileSizeAccepted(file: File): boolean {
    return file.size <= this.maxFileSize;
  }

  public removeFile(): void {
    if (this.fileUrl) {
      URL.revokeObjectURL(this.fileUrl);
    }
    this.file = null;
    this.fileUrl = null;
    this.form.get('file')?.setValue(null);
  }
}
