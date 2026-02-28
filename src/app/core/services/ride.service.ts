import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { APP_CONFIG } from '../tokens/app-config.token';
import { Ride } from '../../features/transport/models/ride.model';
import { VehicleType } from '../../features/transport/models/vehicle-type.enum';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  private readonly ridesUrl: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(APP_CONFIG) private config: { apiBaseUrl: string }
  ) {
    this.ridesUrl = `${this.config.apiBaseUrl}/rides`;
  }

  getAvailableRides(vehicleType?: VehicleType): Observable<Ride[]> {
    const now = new Date();
    const oneHour = 60 * 60 * 1000;
    const lowerBound = new Date(now.getTime() - oneHour);
    const upperBound = new Date(now.getTime() + oneHour);

    return this.http.get<Ride[]>(this.ridesUrl).pipe(
      map(rides => rides.filter(ride => {
        const rideTime = new Date(ride.time);
        const hasVacantSeats = ride.vacantSeats > 0;
        const isTimeMatch = rideTime >= lowerBound && rideTime <= upperBound;
        const isVehicleMatch = vehicleType ? ride.vehicleType === vehicleType : true;

        console.log(`  Ride ID: ${ride.id}, Ride Time: ${rideTime.toISOString()}, isTimeMatch: ${isTimeMatch}, Vacant Seats: ${ride.vacantSeats}, hasVacantSeats: ${hasVacantSeats}`);

        return hasVacantSeats && isTimeMatch && isVehicleMatch;
      }))
    );
  }


  addRide(ride: Omit<Ride, 'id' | 'bookedEmployeeIds'>): Observable<Ride> {
    const rideToAdd: Omit<Ride, 'id'> = {
      ...ride,
      bookedEmployeeIds: [],
    };
    return this.http.post<Ride>(this.ridesUrl, rideToAdd);
  }


  bookRide(rideId: string): Observable<Ride> {
    const currentEmployeeId = this.authService.getEmployeeId();
    if (!currentEmployeeId) {
      return throwError(() => new Error('User is not logged in or employee ID is missing.'));
    }

    const rideUrl = `${this.ridesUrl}/${rideId}`;

    return this.http.get<Ride>(rideUrl).pipe(
      switchMap(ride => {
        if (ride.vacantSeats <= 0) {
          return throwError(() => new Error('No vacant seats available.'));
        }
        if (ride.employeeId === currentEmployeeId) {
          return throwError(() => new Error('You cannot book your own ride.'));
        }
        if (ride.bookedEmployeeIds.includes(currentEmployeeId)) {
          return throwError(() => new Error('You have already booked this ride.'));
        }
        const updatedRide: Ride = {
          ...ride,
          vacantSeats: ride.vacantSeats - 1,
          bookedEmployeeIds: [...ride.bookedEmployeeIds, currentEmployeeId]
        };

        return this.http.put<Ride>(rideUrl, updatedRide);
      })
    );
  }
}
