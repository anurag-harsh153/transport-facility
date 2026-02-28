import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TransportRoutingModule } from './transport-routing-module';
import { AddRideComponent } from './components/add-ride/add-ride.component';
import { RideListComponent } from './components/ride-list/ride-list.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { TransportPageComponent } from './transport-page/transport-page.component';


@NgModule({
  declarations: [
    AddRideComponent,
    RideListComponent,
    FilterPanelComponent,
    TransportPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TransportRoutingModule
  ]
})
export class TransportModule { }
