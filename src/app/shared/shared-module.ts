import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleFilterPipe } from './pipes/vehicle-filter-pipe';
import { VehicleBadgeComponent } from './components/vehicle-badge/vehicle-badge.component';



@NgModule({
  declarations: [
    VehicleFilterPipe,
    VehicleBadgeComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
