import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueKycComponent } from './continue-kyc.component';

describe('ContinueKycComponent', () => {
  let component: ContinueKycComponent;
  let fixture: ComponentFixture<ContinueKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContinueKycComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContinueKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
