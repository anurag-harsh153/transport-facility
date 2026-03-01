To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


1. Do not refresh the page after running the InMemoryDB loses the saved user actions.
2. Use these credentials for testing the application features

```ts
    const users = [
      { id: 'EMP001', username: 'admin', password: 'qawszcer' },
      { id: 'EMP002', username: 'johndoe', password: 'vbynuimm' },
      { id: 'EMP003', username: 'janedoe', password: 'bge5bujnn' },
      { id: 'EMP004', username: 'peterjones', password: 'bbreny6un' }
    ];
```
3. 5.Core functionalities
    a. An auth token is generated for the logged-in user and saved in session storage.
    b. Auth guards are implemented to prevent unauthorized access to protected routes.
    c. Auth interceptors are added to attach headers to HTTP requests.
    d. HTTP error interceptors are added to notify the status of HTTP requests.
    e. A user can add multiple rides.
    f. A user can book only one ride and cannot book the same ride twice.
    g. Seats are updated after every booking.
    h. Rides created by the user are captured and displayed.
    i. Rides booked by the user are captured and displayed.


4. These are initial preloaded rides data
```ts
        const rides: Ride[] = [
            {
                id: '11',
                employeeId: 'EMP003',
                vehicleType: VehicleType.Car,
                vehicleNo: 'TS-07-JA-1234',
                vacantSeats: 2,
                time: this.getTodayTime(currentHour, currentMinute - 30),
                pickupPoint: 'Main Gate',
                destination: 'Tech Park',
                bookedEmployeeIds: ['EMP004']
            },
            {
                id: '12',
                employeeId: 'EMP002',
                vehicleType: VehicleType.Bike,
                vehicleNo: 'AP-05-CD-5678',
                vacantSeats: 0,
                time: this.getTodayTime(currentHour, currentMinute + 15),
                pickupPoint: 'Tech Park',
                destination: 'Central Station',
                bookedEmployeeIds: ['3']
            },
            {
                id: '13',
                employeeId: 'EMP004',
                vehicleType: VehicleType.Car,
                vehicleNo: 'MH-12-EF-9101',
                vacantSeats: 3,
                time: this.getTodayTime(currentHour + 1, currentMinute),
                pickupPoint: 'Main Gate',
                destination: 'Downtown',
                bookedEmployeeIds: []
            },
            {
                id: '14',
                employeeId: 'EMP003',
                vehicleType: VehicleType.Bike,
                vehicleNo: 'KA-01-FG-9876',
                vacantSeats: 1,
                time: this.getTodayTime(currentHour - 1, currentMinute + 10),
                pickupPoint: 'City Center',
                destination: 'Office Park',
                bookedEmployeeIds: []
            }
            ];

    ```

5. To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

