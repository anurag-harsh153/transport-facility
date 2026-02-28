import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleBadgeComponent } from './vehicle-badge.component';

describe('VehicleBadgeComponent', () => {
  let component: VehicleBadgeComponent;
  let fixture: ComponentFixture<VehicleBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
