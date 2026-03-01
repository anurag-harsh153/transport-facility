import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ride } from '../../models/ride.model';
import { RideService } from '../../../../core/services/ride.service';
import { AuthService } from '../../../../core/services/auth.service';
import { VehicleType } from '../../models/vehicle-type.enum';
import { NotificationService } from '../../../../core/services/notification.service';

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
  hasAlreadyBookedToday$!: Observable<boolean>;

  private filterSubject = new BehaviorSubject<VehicleType | undefined>(undefined);

  constructor(
    private rideService: RideService,
    private authService: AuthService,
    private notificationService: NotificationService
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
      })
    );

    this.hasAlreadyBookedToday$ = this.bookedRideByUser$.pipe(
      map(ride => !!ride)
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
        this.notificationService.showSuccess('Ride booked successfully!');
        this.refreshRides(this.currentFilter); 
      },
      error: (err) => {
        this.notificationService.showError(err.message || 'Could not book ride.');
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
    this.notificationService.showSuccess('Ride added successfully!');
    this.showAddRideForm = false;
    this.refreshRides(this.currentFilter);
  }
}
