import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';
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
  bookedRideByUser$!: Observable<Ride | undefined>;

  private filterSubject = new BehaviorSubject<VehicleType | undefined>(undefined);

  constructor(
    private rideService: RideService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.rides$ = combineLatest([
      this.rideService.rides$,
      this.filterSubject.asObservable()
    ]).pipe(
      map(([allRides, filterType]) => {
        const filteredRides = this.rideService.filterRides(allRides, filterType);
        return filteredRides;
      })
    );


    this.bookedRideByUser$ = this.rideService.rides$.pipe(
      map(rides => {
        const currentEmployeeId = this.authService.getEmployeeId();
        const today = new Date().toDateString();

        return rides.find(ride =>
          ride.bookedEmployeeIds.includes(currentEmployeeId || '') &&
          new Date(ride.time).toDateString() === today
        );
      }),
      filter(ride => !!ride)
    );

    this.refreshRides();
  }

  refreshRides(vehicleType?: VehicleType): void {
    this.currentFilter = vehicleType;
    this.filterSubject.next(vehicleType);
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
