import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDeliveriesComponent } from './current-deliveries.component';

describe('CurrentDeliveriesComponent', () => {
  let component: CurrentDeliveriesComponent;
  let fixture: ComponentFixture<CurrentDeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentDeliveriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
