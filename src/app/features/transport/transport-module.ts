import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Ensure this is imported if used by declared components

import { TransportRoutingModule } from './transport-routing-module';
import { AddRideComponent } from './components/add-ride/add-ride.component';
import { RideListComponent } from './components/ride-list/ride-list.component';
import { RideCardComponent } from './components/ride-card/ride-card.component';
import { BookRideComponent } from './components/book-ride/book-ride.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { TransportPageComponent } from './transport-page/transport-page.component';


@NgModule({
  declarations: [
    AddRideComponent,
    RideListComponent,
    RideCardComponent,
    BookRideComponent,
    FilterPanelComponent,
    TransportPageComponent // Add the new parent component
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // Important for form-driven components
    TransportRoutingModule
  ]
})
export class TransportModule { }
