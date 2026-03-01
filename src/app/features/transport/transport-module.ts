import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TransportRoutingModule } from './transport-routing-module';
import { AddRideComponent } from './components/add-ride/add-ride.component';
import { RideListComponent } from './components/ride-list/ride-list.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { TransportPageComponent } from './transport-page/transport-page.component';
import { SharedModule } from '../../shared/shared-module';


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
    TransportRoutingModule,
    SharedModule
  ]
})
export class TransportModule { }
