import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartKycComponent } from './start-kyc.component';

describe('StartKycComponent', () => {
  let component: StartKycComponent;
  let fixture: ComponentFixture<StartKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartKycComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
