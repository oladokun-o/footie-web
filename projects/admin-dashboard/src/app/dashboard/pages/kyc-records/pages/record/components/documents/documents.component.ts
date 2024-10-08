import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserKYC } from 'projects/admin-dashboard/src/app/core/interfaces/user.interface';

@Component({
  selector: 'admin-app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent {
  @Input() record: UserKYC | undefined;
  @Output() editDocuments: EventEmitter<boolean> = new EventEmitter<boolean>();

  editDocumentsInfo(): void {
    this.editDocuments.emit(true);
  }
}
