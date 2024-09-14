import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KYCIsNeededComponent } from './kyc-is-needed.component';

describe('KYCIsNeededComponent', () => {
  let component: KYCIsNeededComponent;
  let fixture: ComponentFixture<KYCIsNeededComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KYCIsNeededComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KYCIsNeededComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
