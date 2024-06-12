import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLocationOnMapComponent } from './select-location-on-map.component';

describe('SelectLocationOnMapComponent', () => {
  let component: SelectLocationOnMapComponent;
  let fixture: ComponentFixture<SelectLocationOnMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectLocationOnMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectLocationOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
