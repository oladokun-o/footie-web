import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tab } from 'projects/admin-dashboard/src/app/core/interfaces/index.interface';

@Component({
  selector: 'admin-app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent {
  @Input() tabs: Tab[] = [];
  @Input() activeTab: Tab = this.tabs[0];
  @Output() activeTabChange: EventEmitter<Tab> = new EventEmitter<Tab>();

  handleTabChange(tab: Tab): void {
    this.tabs.forEach(t => {
      t.active = t.content === tab.content;
    });
    this.activeTab = tab;
    this.activeTabChange.emit(tab);
  }
}
