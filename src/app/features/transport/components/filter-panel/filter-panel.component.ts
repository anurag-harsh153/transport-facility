import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { VehicleType } from '../../models/vehicle-type.enum';

@Component({
  selector: 'app-filter-panel',
  standalone: false,
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent implements OnInit {
  @Output() filterChange = new EventEmitter<VehicleType | undefined>();

  vehicleTypes = Object.values(VehicleType);
  selectedVehicleType: VehicleType | undefined = undefined;

  constructor() { }

  ngOnInit(): void {
  }

  onFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.selectedVehicleType = value === 'all' ? undefined : (value as VehicleType);
    this.filterChange.emit(this.selectedVehicleType);
  }
}
