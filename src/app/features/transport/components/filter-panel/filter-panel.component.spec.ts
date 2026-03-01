import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterPanelComponent } from './filter-panel.component';
import { VehicleType } from '../../models/vehicle-type.enum';

describe('FilterPanelComponent', () => {
  let component: FilterPanelComponent;
  let fixture: ComponentFixture<FilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterPanelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Given the filter panel is loaded', () => {
    describe('When the user changes the filter', () => {
      it('Then it should emit the selected vehicle type', () => {
        const emitSpy = spyOn(component.filterChange, 'emit');
        const mockEvent = { target: { value: VehicleType.Car } } as any;
        component.onFilterChange(mockEvent);
        expect(emitSpy).toHaveBeenCalledWith(VehicleType.Car);
      });

      it('Then it should emit undefined when "All" is selected', () => {
        const emitSpy = spyOn(component.filterChange, 'emit');
        const mockEvent = { target: { value: '' } } as any;
        component.onFilterChange(mockEvent);
        expect(emitSpy).toHaveBeenCalledWith(undefined);
      });
    });

    describe('When the user clicks "Add a new ride"', () => {
      it('Then it should emit addRideClick event', () => {
        const emitSpy = spyOn(component.addRideClick, 'emit');
        component.onAddRideClick();
        expect(emitSpy).toHaveBeenCalled();
      });
    });
  });
});
