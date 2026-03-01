import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AddRideComponent } from './add-ride.component';
import { RideService } from '../../../../core/services/ride.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { VehicleType } from '../../models/vehicle-type.enum';

describe('AddRideComponent', () => {
  let component: AddRideComponent;
  let fixture: ComponentFixture<AddRideComponent>;
  let rideServiceSpy: jasmine.SpyObj<RideService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const rideSpy = jasmine.createSpyObj('RideService', ['addRide']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getEmployeeId']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);

    await TestBed.configureTestingModule({
      declarations: [AddRideComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: RideService, useValue: rideSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRideComponent);
    component = fixture.componentInstance;
    rideServiceSpy = TestBed.inject(RideService) as jasmine.SpyObj<RideService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    fixture.detectChanges();
  });

  describe('Given the add ride form is loaded', () => {
    describe('When the form is submitted with valid data', () => {
      it('Then it should call rideService.addRide and emit rideAdded', () => {
        authServiceSpy.getEmployeeId.and.returnValue('123');
        rideServiceSpy.addRide.and.returnValue(of({} as any));
        const emitSpy = spyOn(component.rideAdded, 'emit');

        component.addRideForm.setValue({
          vehicleType: VehicleType.Car,
          vehicleNo: 'TS-01',
          vacantSeats: 2,
          time: '14:30',
          pickupPoint: 'Office',
          destination: 'Home'
        });
        component.onSubmit();

        expect(rideServiceSpy.addRide).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalled();
      });
    });

    describe('When the user is NOT logged in', () => {
      it('Then it should show an error notification', () => {
        authServiceSpy.getEmployeeId.and.returnValue(null);
        component.addRideForm.setValue({
          vehicleType: VehicleType.Car,
          vehicleNo: 'TS-01',
          vacantSeats: 2,
          time: '14:30',
          pickupPoint: 'Office',
          destination: 'Home'
        });
        component.onSubmit();

        expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Cannot add ride, user is not logged in.');
      });
    });

    describe('When addRide fails', () => {
      it('Then it should show an error notification', () => {
        authServiceSpy.getEmployeeId.and.returnValue('123');
        const errorMsg = 'An error occurred';
        rideServiceSpy.addRide.and.returnValue(throwError(() => new Error(errorMsg)));

        component.addRideForm.setValue({
          vehicleType: VehicleType.Car,
          vehicleNo: 'TS-01',
          vacantSeats: 2,
          time: '14:30',
          pickupPoint: 'Office',
          destination: 'Home'
        });
        component.onSubmit();

        expect(notificationServiceSpy.showError).toHaveBeenCalledWith(errorMsg);
      });
    });

    describe('When the user clicks cancel', () => {
      it('Then it should emit cancelled', () => {
        const emitSpy = spyOn(component.cancelled, 'emit');
        component.onCancel();
        expect(emitSpy).toHaveBeenCalled();
      });
    });
  });
});
