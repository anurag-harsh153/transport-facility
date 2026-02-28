import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RideService } from '../../../../core/services/ride.service';
import { AuthService } from '../../../../core/services/auth.service';
import { VehicleType } from '../../models/vehicle-type.enum';

@Component({
  selector: 'app-add-ride',
  standalone: false,
  templateUrl: './add-ride.component.html',
  styleUrls: ['./add-ride.component.css']
})
export class AddRideComponent implements OnInit {
  addRideForm!: FormGroup;
  vehicleTypes = Object.values(VehicleType);
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private rideService: RideService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.addRideForm = this.fb.group({
      vehicleType: [VehicleType.Car, Validators.required],
      vehicleNo: ['', Validators.required],
      vacantSeats: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      time: ['', Validators.required],
      pickupPoint: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }

  get formControls() {
    return this.addRideForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addRideForm.invalid) {
      return;
    }

    const employeeId = this.authService.getEmployeeId();
    if (!employeeId) {
      console.error('Cannot add ride, user is not logged in.');
      return;
    }

    const formValue = this.addRideForm.value;

    // Combine date from today with time from form
    const today = new Date();
    const [hours, minutes] = formValue.time.split(':');
    today.setHours(hours, minutes, 0, 0);

    const rideData = {
      ...formValue,
      time: today.toISOString(),
      employeeId: employeeId
    };

    this.rideService.addRide(rideData).subscribe({
      next: () => {
        console.log('Ride added successfully!');
        // Navigate to the ride list or a success page
        this.router.navigate(['/transport']);
      },
      error: (err) => {
        console.error('Failed to add ride', err);
      }
    });
  }
}
