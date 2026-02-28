import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Ride } from '../../models/ride.model';
import { RideService } from '../../../../core/services/ride.service';
import { AuthService } from '../../../../core/services/auth.service';
import { VehicleType } from '../../models/vehicle-type.enum';

@Component({
  selector: 'app-ride-list',
  standalone: false,
  templateUrl: './ride-list.component.html',
  styleUrls: ['./ride-list.component.css']
})
export class RideListComponent implements OnInit {
  rides$!: Observable<Ride[]>;
  currentFilter: VehicleType | undefined = undefined;
  showAddRideForm: boolean = false;

  constructor(
    private rideService: RideService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.refreshRides();
  }

  refreshRides(vehicleType?: VehicleType): void {
    this.currentFilter = vehicleType;
    this.rides$ = this.rideService.getAvailableRides(this.currentFilter);
  }

  bookRide(rideId: string): void {
    this.rideService.bookRide(rideId).subscribe({
      next: (updatedRide) => {
        console.log('Ride booked successfully!', updatedRide);
        this.refreshRides(this.currentFilter);
      },
      error: (err) => {
        console.error('Failed to book ride:', err.message);
        alert(err.message || 'Could not book ride.');
      }
    });
  }

  isMyRide(ride: Ride): boolean {
    return ride.employeeId === this.authService.getEmployeeId();
  }

  hasBooked(ride: Ride): boolean {
    return ride.bookedEmployeeIds.includes(this.authService.getEmployeeId() || '');
  }

  toggleAddRideForm(): void {
    this.showAddRideForm = !this.showAddRideForm;
  }

  onRideAdded(): void {
    this.showAddRideForm = false;
    this.refreshRides(this.currentFilter);
  }
}
