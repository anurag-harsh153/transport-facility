import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRideComponent } from './components/add-ride/add-ride.component';
import { RideListComponent } from './components/ride-list/ride-list.component';
import { TransportPageComponent } from './transport-page/transport-page.component'; // Import the new parent component
import { authGuard } from '../../core/guards/auth-guard'; // Import authGuard

const routes: Routes = [
  {
    path: '',
    component: TransportPageComponent, // Parent component for transport feature layout
    canActivate: [authGuard], // Apply guard to the parent route
    children: [
      {
        path: '', // Default child route for RideListComponent
        component: RideListComponent
      },
      {
        path: 'add', // Child route for AddRideComponent
        component: AddRideComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportRoutingModule { }
