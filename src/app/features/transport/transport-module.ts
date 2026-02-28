import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportRoutingModule } from './transport-routing-module';
import { AddRideComponent } from './components/add-ride/add-ride.component';
import { RideListComponent } from './components/ride-list/ride-list.component';
import { RideCardComponent } from './components/ride-card/ride-card.component';
import { BookRideComponent } from './components/book-ride/book-ride.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';


@NgModule({
  declarations: [
    AddRideComponent,
    RideListComponent,
    RideCardComponent,
    BookRideComponent,
    FilterPanelComponent
  ],
  imports: [
    CommonModule,
    TransportRoutingModule
  ]
})
export class TransportModule { }
