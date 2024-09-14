import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { KYCStep, User, UserKYC } from 'src/app/core/interfaces/user.interface';
import { KycService } from 'src/app/core/services/kyc.service';
import { environment } from 'src/environments/environment';
import { KYCIsNeededComponent } from '../../modals/kyc-is-needed/kyc-is-needed.component';
import { DocFile } from './index.interface';

@Component({
  selector: 'footiedrop-web-start-kyc',
  templateUrl: './start-kyc.component.html',
  styleUrls: ['./start-kyc.component.scss']
})
export class StartKycComponent implements OnInit {
  user!: User;
  loading: boolean = false;
  isMobile!: boolean;
  isTablet!: boolean;

  KYC!: UserKYC;

  get userData(): { email: string, userId: string } {
    return JSON.parse(localStorage.getItem('userSessionData') as string);
  }

  get kycHasAllDocuments(): boolean {
    return this.KYC && this.KYC.internationalPassport && this.KYC.schoolID && this.KYC.selfie;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private kycService: KycService,
    private toaster: ToastrService,
    private deviceService: DeviceDetectorService,
    private modalService: NgbModal
  ) {
    this.route.data.subscribe((data) => {
      if (data['user']) {
        this.user = data['user'];

        if (this.user && this.user.kyc) {
          this.KYC = this.user.kyc;
          this.checkKYC(this.user.kyc, true);
        };

        this.initiateKYC();
      } else if (this.userData) {
        this.getUser(this.userData.userId);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  KYCForm: FormGroup = new FormGroup({
    internationalPassport: new FormControl(null, [Validators.required]),
    // russianPassport: new FormControl(null, [Validators.required]),
    schoolID: new FormControl(null, [Validators.required]),
    selfie: new FormControl(null, [Validators.required]),
  });

  private getUser(userId: string): void {
    this.kycService.getUserByIDForVerification(userId).subscribe(
      (fetchedUser) => {
        if (fetchedUser) {
          this.user = fetchedUser;
          if (!this.isMobile && !this.isTablet && this.user && !this.qrCodeData) {
            // generate qr code for desktop to navigate to mobile
            this.generateQRCode();
          }
        }
      },
      (error) => {
        this.router.navigate(['/login']);
      }
    )
  }

  ngOnInit(): void {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();

    if (!this.isMobile && !this.isTablet && this.user) {
      // generate qr code for desktop to navigate to mobile
      this.generateQRCode();
    };
  }

  disableForm: boolean = false;
  submitButtonLabel: string = 'Upload Documents';

  initiateKYC() {
    this.kycService.initiateKYC(this.user.id).subscribe(
      (response) => {
        this.loading = false;
        if (response) {
          if (response.data) {
            this.KYC = response.data;
            this.user.kyc = this.KYC;
            this.checkKYC(this.KYC);
          }
        }
      },
      (error) => {
        this.loading = false;
        this.toaster.error(error.message);
      }
    )
  }

  private checkKYC(kyc?: UserKYC, showToast?: boolean): void {
    if (kyc) {
      // Update the form with the KYC details and disable the control
      if (kyc.internationalPassport) {
        this.KYCForm.get('internationalPassport')?.setValue(kyc.internationalPassport);
        this.KYCForm.get('internationalPassport')?.disable();
      }

      if (kyc.schoolID) {
        this.KYCForm.get('schoolID')?.setValue(kyc.schoolID);
        this.KYCForm.get('schoolID')?.disable();
      }

      if (kyc.selfie) {
        this.KYCForm.get('selfie')?.setValue(kyc.selfie);
        this.KYCForm.get('selfie')?.disable();
      }

      if (kyc.status === "pending" && this.KYCForm.valid) {
        this.disableForm = true;
        this.submitButtonLabel = 'Under Review';
        if (showToast) this.toaster.info('Your KYC is pending verification. You will be notified once it is approved.');
      };

      if (kyc.status === "pending" && kyc.step === KYCStep.REVIEW) {
        this.disableForm = true;
        this.submitButtonLabel = 'Under Review';
      }

      this.loading = false;
    }
  }

  qrCodeData: string = '';
  generateQRCode() {
    let host = environment.production ? 'https://footiedrop.netlify.app' : 'http://192.168.61.246:4200';
    this.qrCodeData = `${host}/kyc/continue?userId=${this.user.id}`;
  }

  showWhyKYCisNeededModal(): void {
    const modalRef = this.modalService.open(KYCIsNeededComponent, {
      size: 'lg',
      centered: true,
      scrollable: true,
    });
  }

  // International Passport Element View
  @ViewChild('internationalPassportElement') internationalPassportElement: ElementRef<HTMLInputElement> | undefined;
  internationalPassportFile: DocFile | undefined;

  // School ID Element View
  @ViewChild('schoolIDElement') schoolIDElement: ElementRef<HTMLInputElement> | undefined;
  schoolIDFile: DocFile | undefined;

  // Selfie Element View
  @ViewChild('selfieElement') selfieElement: ElementRef<HTMLInputElement> | undefined;
  selfieFile: DocFile | undefined;

  maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

  // Method to trigger the file input click based on the document type
  proceed(item: 'internationalPassport' | 'schoolID' | 'selfie') {
    if (item === 'internationalPassport' && this.internationalPassportElement && this.KYCForm.get('internationalPassport')?.enabled) {
      this.internationalPassportElement.nativeElement.click();
    } else if (item === 'schoolID' && this.schoolIDElement && this.KYCForm.get('schoolID')?.enabled) {
      this.schoolIDElement.nativeElement.click();
    } else if (item === 'selfie' && this.selfieElement && this.KYCForm.get('selfie')?.enabled) {
      this.selfieElement.nativeElement.click();
    }
  }

  // Method to handle file change when user selects a file
  onFileChange(event: any, item: 'internationalPassport' | 'schoolID' | 'selfie') {
    const file: File = event.target.files[0]; // Get the selected file

    if (file) {
      // Get allowed file types from the input element
      const allowedFileTypes: string[] = event.target.accept.split(',').map((type: string) => type.trim());

      // Validate file type
      if (!allowedFileTypes.includes(file.type)) {
        console.error(`Invalid file type for ${item}. Only ${allowedFileTypes.join(', ')} are allowed.`);
        this.toaster.error(`Invalid file type. Only ${allowedFileTypes.join(', ')} are allowed.`);
        return;
      }

      // Validate file size
      if (file.size > this.maxFileSize) {
        console.error(`File size for ${item} exceeds the maximum limit of 5MB.`);
        this.toaster.error('File size exceeds the maximum limit of 5MB.');
        return;
      }

      // Create a date object for when the file was selected
      const currentDate = new Date().toLocaleString();

      // Rename the file to include the user's name
      const newFileName = `${this.user.firstName}_${this.user.lastName}_${this.user.email}_${item}_${currentDate.replace(/[^0-9]/g, '')}`;

      // Rename the file object (if necessary) or handle it for backend upload
      const renamedFile = new File([file], newFileName, { type: file.type });

      // Populate the DocFile object with file details
      const fileDetails: DocFile = {
        name: renamedFile.name,
        size: `${(file.size / 1024).toFixed(2)} KB`, // Convert size to KB
        date: currentDate,
        type: renamedFile.type
      };

      // Assign the file details to the respective document field
      if (item === 'internationalPassport') {
        this.internationalPassportFile = fileDetails;
        this.KYCForm.get('internationalPassport')?.setValue(renamedFile);
      } else if (item === 'schoolID') {
        this.schoolIDFile = fileDetails;
        this.KYCForm.get('schoolID')?.setValue(renamedFile);
      } else if (item === 'selfie') {
        this.selfieFile = fileDetails;
        this.KYCForm.get('selfie')?.setValue(renamedFile);
      }
    } else {
      console.error(`No file selected for ${item}.`);
    }
  }

  // modal content TemplateRef<any>
  @ViewChild('confirmKYCSubmissionModal') confirmKYCSubmissionModal: TemplateRef<any> | undefined;


  submitKYC(): void {
    if (this.KYCForm.valid && !this.kycHasAllDocuments) {
      // confirm modal
      this.modalService.open(this.confirmKYCSubmissionModal, {
        centered: true,
        backdrop: 'static',
        keyboard: false,
      });
    }
  }

  proceedToSubmitKYC(): void {
    this.modalService.dismissAll();
    this.loading = true;

    const controls: { [key: string]: any } = this.KYCForm.controls;

    let payload = {
      internationalPassport: controls['internationalPassport'].value,
      schoolID: controls['schoolID'].value,
      selfie: controls['selfie'].value,
    }

    this.kycService.submitKYC(this.user.id, payload).subscribe(
      (response) => {
        if (response) {
          this.toaster.success(response.message || 'KYC submitted successfully.', '', {
            timeOut: 10000,
          });
          // check KYC
          this.checkKYC(response.data);
          this.KYC = response.data;
          this.user.kyc = this.KYC;
        } else {
          this.loading = false;
          this.toaster.error('An error occurred while submitting KYC. Please try again.');
        }
      },
      (error) => {
        console.error('Error submitting KYC:', error);
        this.loading = false;
        this.toaster.error(error.message || 'An error occurred while submitting KYC. Please try again.');
      }
    );
  }
}
