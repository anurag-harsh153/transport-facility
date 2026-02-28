import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { APP_CONFIG } from '../tokens/app-config.token';
import { Ride } from '../../features/transport/models/ride.model';
import { VehicleType } from '../../features/transport/models/vehicle-type.enum';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  private readonly ridesUrl: string;
  private _ridesSubject = new BehaviorSubject<Ride[]>([]);
  public readonly rides$: Observable<Ride[]> = this._ridesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(APP_CONFIG) private config: { apiBaseUrl: string }
  ) {
    this.ridesUrl = `${this.config.apiBaseUrl}/rides`;
    this.loadInitialRides();
  }

  private loadInitialRides(): void {
    this.http.get<Ride[]>(this.ridesUrl).pipe(
      tap(rides => console.log('RideService: Initial rides loaded:', rides))
    ).subscribe(
      rides => this._ridesSubject.next(rides),
      error => console.error('Error loading initial rides:', error)
    );
  }

  private refreshRidesData(): Observable<Ride[]> {
    return this.http.get<Ride[]>(this.ridesUrl).pipe(
      tap(rides => {
        this._ridesSubject.next(rides);
        console.log('RideService: Data refreshed, new rides state:', rides);
      })
    );
  }

  filterRides(rides: Ride[], vehicleType?: VehicleType): Ride[] {
    const now = new Date();
    const oneHour = 60 * 60 * 1000;
    const lowerBound = new Date(now.getTime() - oneHour);
    const upperBound = new Date(now.getTime() + oneHour);

    return rides.filter(ride => {
      const rideTime = new Date(ride.time);
      const hasVacantSeats = ride.vacantSeats > 0;
      const isTimeMatch = rideTime >= lowerBound && rideTime <= upperBound;
      const isVehicleMatch = vehicleType ? ride.vehicleType === vehicleType : true;

      return hasVacantSeats && isTimeMatch && isVehicleMatch;
    });
  }

  getAvailableRides(vehicleType?: VehicleType): Observable<Ride[]> {
    return this.rides$.pipe(
      map(rides => this.filterRides(rides, vehicleType))
    );
  }

  addRide(ride: Omit<Ride, 'id' | 'bookedEmployeeIds'>): Observable<Ride> {
    const rideToAdd: Omit<Ride, 'id'> = {
      ...ride,
      bookedEmployeeIds: [],
    };
    return this.http.post<Ride>(this.ridesUrl, rideToAdd).pipe(
      switchMap(newRide => this.refreshRidesData().pipe(map(() => newRide)))
    );
  }

  bookRide(rideId: string): Observable<Ride> {
    const currentEmployeeId = this.authService.getEmployeeId();
    if (!currentEmployeeId) {
      return throwError(() => new Error('User is not logged in or employee ID is missing.'));
    }

    const rideUrl = `${this.ridesUrl}/${rideId}`;

    const allRidesSnapshot = this._ridesSubject.getValue(); // Get current allRides snapshot for validation

    return this.http.get<Ride>(rideUrl).pipe(
      switchMap(ride => {
        if (ride.vacantSeats <= 0) {
          return throwError(() => new Error('No vacant seats available.'));
        }
        if (ride.bookedEmployeeIds.includes(currentEmployeeId)) {
          return throwError(() => new Error('You have already booked this ride.'));
        }

        const rideBeingBookedDate = new Date(ride.time).toDateString();

        const alreadyBookedAnotherRide = allRidesSnapshot.some(existingRide => // Use the snapshot
          existingRide.id !== ride.id &&
          existingRide.bookedEmployeeIds.includes(currentEmployeeId || '') &&
          new Date(existingRide.time).toDateString() === rideBeingBookedDate
        );

        if (alreadyBookedAnotherRide) {
          return throwError(() => new Error('You can only book one ride per day.'));
        }

        const updatedRide: Ride = {
          ...ride,
          vacantSeats: ride.vacantSeats - 1,
          bookedEmployeeIds: [...ride.bookedEmployeeIds, currentEmployeeId]
        };
        console.log('RideService: Updated Ride Object before PUT:', updatedRide);

        return this.http.put<Ride>(rideUrl, updatedRide).pipe(
          tap(response => console.log('RideService: PUT response:', response)),
          switchMap(response => this.refreshRidesData().pipe(map(() => response)))
        );
      })
    );
  }
}
