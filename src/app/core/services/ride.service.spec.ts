import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RideService } from './ride.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { APP_CONFIG } from '../tokens/app-config.token';
import { VehicleType } from '../../features/transport/models/vehicle-type.enum';
import { of, throwError } from 'rxjs';
import { Ride } from '../../features/transport/models/ride.model';
import { skip } from 'rxjs/operators';

describe('RideService', () => {
  let service: RideService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getEmployeeId']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RideService,
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: APP_CONFIG, useValue: { apiBaseUrl: 'api' } }
      ]
    });
    service = TestBed.inject(RideService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    const initialReq = httpMock.expectOne('api/rides');
    initialReq.flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Given the initial rides are loaded', () => {
    describe('When getAvailableRides is called', () => {
      it('Then it should filter and return available rides within the hour range', (done) => {
        const now = new Date();
        const futureRide: Ride = { 
          id: '1', 
          employeeId: 'emp1',
          vehicleType: VehicleType.Car, 
          vehicleNo: 'TS-01',
          vacantSeats: 1, 
          time: new Date(now.getTime() + 30 * 60000).toISOString(),
          pickupPoint: 'A',
          destination: 'B',
          bookedEmployeeIds: []
        };
        const pastRide: Ride = { 
          id: '2', 
          employeeId: 'emp2',
          vehicleType: VehicleType.Car, 
          vehicleNo: 'TS-02',
          vacantSeats: 1, 
          time: new Date(now.getTime() - 2 * 60 * 60000).toISOString(),
          pickupPoint: 'A',
          destination: 'B',
          bookedEmployeeIds: []
        };
        
        service.getAvailableRides().pipe(skip(1)).subscribe(rides => {
          expect(rides.length).toBe(1);
          expect(rides[0].id).toBe('1');
          done();
        });
        
        (service as any)._ridesSubject.next([futureRide, pastRide]);
      });
    });
  });

  describe('Given the user attempts to add a ride', () => {
    describe('When the user is logged in', () => {
      it('Then it should post the ride and refresh the list', () => {
        authServiceSpy.getEmployeeId.and.returnValue('123');
        const newRide = { 
          employeeId: '123',
          vehicleType: VehicleType.Car, 
          vehicleNo: 'TS-01', 
          vacantSeats: 1, 
          time: new Date().toISOString(), 
          pickupPoint: 'A', 
          destination: 'B' 
        };
        const mockResponse: Ride = { id: '10', ...newRide, bookedEmployeeIds: [] };

        service.addRide(newRide).subscribe(res => {
          expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('api/rides');
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        const refreshReq = httpMock.expectOne('api/rides');
        refreshReq.flush([mockResponse]);
      });
    });

    describe('When the user is NOT logged in', () => {
      it('Then it should throw an error', () => {
        authServiceSpy.getEmployeeId.and.returnValue(null);
        service.addRide({} as any).subscribe({
          error: (err) => {
            expect(err.message).toBe('User is not logged in or employee ID is missing.');
          }
        });
      });
    });
  });

  describe('Given the user attempts to book a ride', () => {
    describe('When valid booking conditions are met', () => {
      it('Then it should put the updated ride and refresh the list', () => {
        authServiceSpy.getEmployeeId.and.returnValue('123');
        const ride: Ride = { 
          id: '1', 
          employeeId: 'emp1',
          vehicleType: VehicleType.Car, 
          vehicleNo: 'TS-01',
          vacantSeats: 1, 
          time: new Date().toISOString(), 
          pickupPoint: 'A',
          destination: 'B',
          bookedEmployeeIds: [] 
        };
        (service as any)._ridesSubject.next([ride]);

        service.bookRide('1').subscribe(res => {
          expect(res.vacantSeats).toBe(0);
          expect(res.bookedEmployeeIds).toContain('123');
        });

        const getReq = httpMock.expectOne('api/rides/1');
        getReq.flush(ride);

        const putReq = httpMock.expectOne('api/rides/1');
        expect(putReq.request.method).toBe('PUT');
        putReq.flush({ ...ride, vacantSeats: 0, bookedEmployeeIds: ['123'] });

        const refreshReq = httpMock.expectOne('api/rides');
        refreshReq.flush([]);
      });
    });

    describe('When no vacant seats are available', () => {
      it('Then it should throw an error', () => {
        authServiceSpy.getEmployeeId.and.returnValue('123');
        const ride: Ride = { 
          id: '1', 
          employeeId: 'emp1',
          vehicleType: VehicleType.Car, 
          vehicleNo: 'TS-01',
          vacantSeats: 0, 
          time: new Date().toISOString(), 
          pickupPoint: 'A',
          destination: 'B',
          bookedEmployeeIds: [] 
        };
        (service as any)._ridesSubject.next([ride]);

        service.bookRide('1').subscribe({
          error: (err) => {
            expect(err.message).toBe('No vacant seats available.');
          }
        });

        const getReq = httpMock.expectOne('api/rides/1');
        getReq.flush(ride);
      });
    });
  });
});
