import { Component, Input } from '@angular/core';

@Component({
  selector: 'admin-app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent {
  @Input() infoCards: InfoCard[] = [];
  @Input() loading: boolean = false;
}

export interface InfoCard {
  title: string;
  value: number;
  type: 'info' | 'warning' | 'danger' | 'success' | 'primary' | 'pending';
  size?: number;
}
