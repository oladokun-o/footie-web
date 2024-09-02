import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/interfaces/user.interface';
import { KycService } from 'src/app/core/services/kyc.service';
import { environment } from 'src/environments/environment';

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

  get userData(): { email: string, userId: string } {
    return JSON.parse(localStorage.getItem('userSessionData') as string);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private kycService: KycService,
    private toaster: ToastrService,
    private deviceService: DeviceDetectorService
  ) {
    this.route.data.subscribe((data) => {
      if (data['user']) {
        this.user = data['user'];
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
    }
  }

  initiateKYC() {
    this.kycService.initiateKYC(this.user.id).subscribe(
      (response) => {
        if (response) {

        }
      },
      (error) => {
        this.toaster.error(error.message);
      }
    )
  }

  qrCodeData: string = '';
  generateQRCode() {
    let host = environment.production ? 'https://footiedrop.netlify.app' : 'http://192.168.61.246:4200';
    this.qrCodeData = `${host}/kyc/continue?userId=${this.user.id}`;
  }
}
