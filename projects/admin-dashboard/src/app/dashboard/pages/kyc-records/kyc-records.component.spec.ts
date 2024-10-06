import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycRecordsComponent } from './kyc-records.component';

describe('KycRecordsComponent', () => {
  let component: KycRecordsComponent;
  let fixture: ComponentFixture<KycRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycRecordsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
