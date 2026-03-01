import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { RideListComponent } from './ride-list.component';
import { RideService } from '../../../../core/services/ride.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { VehicleType } from '../../models/vehicle-type.enum';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Ride } from '../../models/ride.model';
import { skip } from 'rxjs/operators';

describe('RideListComponent', () => {
  let component: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;
  let rideServiceSpy: jasmine.SpyObj<RideService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let ridesSubject: BehaviorSubject<Ride[]>;

  beforeEach(async () => {
    ridesSubject = new BehaviorSubject<Ride[]>([]);
    const rideSpy = jasmine.createSpyObj('RideService', ['filterRides', 'bookRide'], {
      rides$: ridesSubject.asObservable()
    });
    const authSpy = jasmine.createSpyObj('AuthService', ['getEmployeeId']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);

    await TestBed.configureTestingModule({
      declarations: [RideListComponent],
      providers: [
        { provide: RideService, useValue: rideSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RideListComponent);
    component = fixture.componentInstance;
    rideServiceSpy = TestBed.inject(RideService) as jasmine.SpyObj<RideService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  describe('Given the ride list is loaded', () => {
    describe('When the component is initialized', () => {
      it('Then it should load the filtered rides', (done) => {
        const mockRides: Ride[] = [{ 
          id: '1', 
          employeeId: 'emp1',
          vehicleType: VehicleType.Car,
          vehicleNo: 'TS-01',
          vacantSeats: 2,
          time: new Date().toISOString(),
          pickupPoint: 'A', 
          destination: 'B',
          bookedEmployeeIds: []
        }];
        rideServiceSpy.filterRides.and.returnValue(mockRides);
        
        ridesSubject.next(mockRides);
        fixture.detectChanges();

        component.rides$.subscribe(rides => {
          expect(rides).toEqual(mockRides);
          done();
        });
      });
    });

    describe('When the user books a ride successfully', () => {
      it('Then it should show a success notification', () => {
        rideServiceSpy.bookRide.and.returnValue(of({} as any));
        component.bookRide('1');
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Ride booked successfully!');
      });
    });

    describe('When booking a ride fails', () => {
      it('Then it should show an error notification', () => {
        const errorMsg = 'Failed to book ride';
        rideServiceSpy.bookRide.and.returnValue(throwError(() => new Error(errorMsg)));
        component.bookRide('1');
        expect(notificationServiceSpy.showError).toHaveBeenCalledWith(errorMsg);
      });
    });

    describe('When toggleAddRideForm is called', () => {
      it('Then it should toggle showAddRideForm', () => {
        expect(component.showAddRideForm).toBeFalse();
        component.toggleAddRideForm();
        expect(component.showAddRideForm).toBeTrue();
        component.toggleAddRideForm();
        expect(component.showAddRideForm).toBeFalse();
      });
    });

    describe('When onRideAdded is called', () => {
      it('Then it should show a success notification and close the form', () => {
        component.showAddRideForm = true;
        component.onRideAdded();
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Ride added successfully!');
        expect(component.showAddRideForm).toBeFalse();
      });
    });
  });
});
