import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  KYCStep,
  UserKYC,
} from 'projects/admin-dashboard/src/app/core/interfaces/user.interface';

interface KYCInfoFormControls {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
}

@Component({
  selector: 'admin-app-kyc-info',
  templateUrl: './kyc-info.component.html',
  styleUrls: ['./kyc-info.component.scss'],
})
export class KycInfoComponent implements OnInit {
  @Input() record: UserKYC | undefined;
  canEditKYC: boolean = false;

  @Output() editKYC: EventEmitter<boolean> = new EventEmitter<boolean>();

  KYCInfoForm!: FormGroup<KYCInfoFormControls>;

  zoomActive: boolean = false;
  currentZoomLevel: string = 'scale(1)'; // Initial zoom level
  zoomFactor: number = 1; // To track zoom level

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private renderer: Renderer2,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    if (this.record) {
      this.KYCInfoForm = this.formBuilder.group({
        firstName: new FormControl(this.record.user.firstName),
        lastName: new FormControl(this.record.user.lastName),
        email: new FormControl(this.record.user.email),
        phone: new FormControl(this.record.user.phone),
      });
    }
  }

  editKYCInfo(): void {
    if (this.KYCInfoForm.valid) {
      this.editKYC.emit(true);
    }
  }

  showKYCStep(step: KYCStep): string {
    const stepLabels = {
      [KYCStep.START]: 'Started, Pending Documents',
      [KYCStep.SUBMIT_SELFIE]: 'Missing Selfie',
      [KYCStep.SUBMIT_INTERNATIONAL_PASSPORT]: 'Missing International Passport',
      [KYCStep.SUBMIT_RUSSIAN_PASSPORT]: 'Missing Russian Passport',
      [KYCStep.SUBMIT_SCHOOL_ID]: 'Missing School ID',
      [KYCStep.REVIEW]: 'In Review',
      [KYCStep.COMPLETE]: 'Completed',
    };
    return stepLabels[step] || 'Unknown Step';
  }

  activeModalImage: string | null = null;

  displayImage(content: TemplateRef<any>, image: string): void {
    this.activeModalImage = image;
    const ref = this.modalService.open(content, {
      centered: true,
      modalDialogClass: 'overflow-hidden image-preview-modal',
    });

    ref.dismissed.subscribe(() => {
      this.activeModalImage = null;
    });
  }

  handleImageError(imageEl: HTMLImageElement): void {
    imageEl.src = `https://dummyimage.com/600x400/000/fff&text=Image+Not+Found`;
  }

  downloadImage(imageUrl: string) {
    // Fetch the image from the URL, convert it to a blob, and trigger a download
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = `${this.record?.user.firstName}_${this.record?.user.lastName}_image.jpg`;
        link.click();

        // Clean up the URL object
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        this.toastr.error('Failed to download image, please try again later');
      });
  }

  // Zoom the image based on mouse position
  zoomImage(event: MouseEvent) {
    const imgElement = event.target as HTMLImageElement;

    if (imgElement) {
      const rect = imgElement.getBoundingClientRect();
      const x = event.clientX - rect.left; // X position of the cursor relative to the image container
      const y = event.clientY - rect.top; // Y position of the cursor relative to the image container

      // Calculate percentage of cursor position relative to the container dimensions
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      // Set the transform origin based on cursor position
      this.renderer.setStyle(
        imgElement,
        'transform-origin',
        `${xPercent}% ${yPercent}%`
      );
      this.renderer.setStyle(imgElement, 'transform', 'scale(2)'); // 2x zoom level
      this.zoomActive = true; // Set zoom state
    }
  }

  resetZoom(event: MouseEvent) {
    const imgContainer = event.target as HTMLElement; // Use HTMLElement to cover both cases
    const imgElement = imgContainer.querySelector('img');

    // Only reset zoom if zoom was active
    if (this.zoomActive && imgElement) {
      this.currentZoomLevel = 'scale(1)';
      this.renderer.setStyle(imgElement, 'transform', this.currentZoomLevel);
      this.renderer.setStyle(imgElement, 'transform-origin', 'center');
      this.zoomActive = false; // Reset zoom state
    }
  }

  zoomIn(event: HTMLImageElement) {
    this.zoomFactor += 0.2; // Increment zoom factor
    this.updateZoom(event);
  }

  zoomOut(event: HTMLImageElement) {
    this.zoomFactor = Math.max(1, this.zoomFactor - 0.2); // Prevent zooming out too much
    this.updateZoom(event);
  }

  updateZoom(event: HTMLImageElement) {
    const imgElement = event;
    if (imgElement) {
      this.currentZoomLevel = `scale(${this.zoomFactor})`;
      this.renderer.setStyle(imgElement, 'transform', this.currentZoomLevel); // Apply zoom level
    }
  }
}
