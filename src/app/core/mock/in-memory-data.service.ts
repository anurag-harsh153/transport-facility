import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Ride } from '../../features/transport/models/ride.model';
import { VehicleType } from '../../features/transport/models/vehicle-type.enum';

export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const users = [
      { id: '1', username: 'admin', password: 'password' },
      { id: '2', username: 'john.doe', password: 'password' },
      { id: '3', username: 'jane.doe', password: 'password' },
      { id: '4', username: 'peter.jones', password: 'password' }
    ];

    const rides: Ride[] = [
      {
        id: '11',
        employeeId: '3',
        vehicleType: VehicleType.Car,
        vehicleNo: 'TS-07-JA-1234',
        vacantSeats: 2,
        time: this.getTodayTime(9, 30),
        pickupPoint: 'Main Gate',
        destination: 'Tech Park',
        bookedEmployeeIds: ['4']
      },
      {
        id: '12',
        employeeId: '2',
        vehicleType: VehicleType.Bike,
        vehicleNo: 'AP-05-CD-5678',
        vacantSeats: 0,
        time: this.getTodayTime(18, 0),
        pickupPoint: 'Tech Park',
        destination: 'Central Station',
        bookedEmployeeIds: ['3']
      },
      {
        id: '13',
        employeeId: '4',
        vehicleType: VehicleType.Car,
        vehicleNo: 'MH-12-EF-9101',
        vacantSeats: 3,
        time: this.getTodayTime(10, 0),
        pickupPoint: 'Main Gate',
        destination: 'Tech Park',
        bookedEmployeeIds: []
      }
    ];

    return { users, rides, login: [] };
  }


  private getTodayTime(hour: number, minute: number): string {
    const today = new Date();
    today.setHours(hour, minute, 0, 0);
    return today.toISOString();
  }


  genId(collection: { id: string }[], collectionName: string): string {
    if (collectionName === 'rides' && collection.length > 0) {
      return (Math.max(...collection.map(item => +item.id)) + 1).toString();
    }
    return Date.now().toString();
  }

  post(reqInfo: RequestInfo) {
    if (reqInfo.collectionName === 'login') {
      const body = reqInfo.utils.getJsonBody(reqInfo.req);
      const { username, password } = body;
      const user = this.createDb().users.find(
        (u: any) => u.username === username && u.password === password
      );

      if (user) {
        return reqInfo.utils.createResponse$(() => ({
          status: 200,
          body: {
            token: 'fake-jwt-token-for-' + user.username,
            employeeId: user.id
          }
        }));
      }

      return reqInfo.utils.createResponse$(() => ({
        status: 401,
        body: { message: 'Invalid credentials' }
      }));
    }
    return undefined;
  }
}