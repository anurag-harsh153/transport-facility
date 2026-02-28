import { InMemoryDbService, RequestInfo, STATUS, RequestInfoUtilities } from 'angular-in-memory-web-api';
import { Ride } from '../../features/transport/models/ride.model';
import { VehicleType } from '../../features/transport/models/vehicle-type.enum';
import { Observable } from 'rxjs';

export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const users = [
      { id: '1', username: 'admin', password: 'password' },
      { id: '2', username: 'john.doe', password: 'password' },
      { id: '3', username: 'jane.doe', password: 'password' },
      { id: '4', username: 'peter.jones', password: 'password' }
    ];

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const rides: Ride[] = [
      {
        id: '11',
        employeeId: '3',
        vehicleType: VehicleType.Car,
        vehicleNo: 'TS-07-JA-1234',
        vacantSeats: 2,
        time: this.getTodayTime(currentHour, currentMinute - 30),
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
        time: this.getTodayTime(currentHour, currentMinute + 15),
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
        time: this.getTodayTime(currentHour + 1, currentMinute),
        pickupPoint: 'Main Gate',
        destination: 'Downtown',
        bookedEmployeeIds: []
      },
      {
        id: '14',
        employeeId: '3',
        vehicleType: VehicleType.Bike,
        vehicleNo: 'KA-01-FG-9876',
        vacantSeats: 1,
        time: this.getTodayTime(currentHour - 1, currentMinute + 10),
        pickupPoint: 'City Center',
        destination: 'Office Park',
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

  requestInterceptor(reqInfo: RequestInfo) {
    const { collectionName, headers, utils } = reqInfo;

    if (collectionName === 'login') {
      return undefined;
    }

    const authHeader = headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token || !token.startsWith('fake-jwt-token')) {
      const response = utils.createResponse$(() => ({
        body: { message: 'Unauthorized: Missing or invalid token' },
        status: STATUS.UNAUTHORIZED,
        headers: reqInfo.headers,
        url: reqInfo.url
      }));
      return response;
    }

    return undefined;
  }

  // Custom PUT handler for debugging
  put(reqInfo: RequestInfo): Observable<any> | undefined {
    if (reqInfo.collectionName === 'rides') {
      const collection = reqInfo.collection as Ride[];
      const rideToUpdate: Ride = reqInfo.utils.getJsonBody(reqInfo.req);
      const index = collection.findIndex(r => r.id === rideToUpdate.id);

      console.log('InMemoryDataService: PUT request for rides. Data received:', rideToUpdate);
      console.log('InMemoryDataService: Current rides collection before update:', [...collection]);

      if (index > -1) {
        collection[index] = rideToUpdate;
        console.log('InMemoryDataService: Rides collection after update:', [...collection]);
        return reqInfo.utils.createResponse$(() => ({
          body: rideToUpdate,
          status: STATUS.OK,
          headers: reqInfo.headers,
          url: reqInfo.url
        }));
      } else {
        console.log('InMemoryDataService: Ride not found for update:', rideToUpdate.id);
        return reqInfo.utils.createResponse$(() => ({
          body: { message: `Ride with id '${rideToUpdate.id}' not found` },
          status: STATUS.NOT_FOUND,
          headers: reqInfo.headers,
          url: reqInfo.url
        }));
      }
    }
    return undefined;
  }

  post(reqInfo: RequestInfo) {
    if (reqInfo.collectionName === 'login') {
      const body = reqInfo.utils.getJsonBody(reqInfo.req);
      const { username, password } = body;
      const users = this.createDb().users;
      const user = users.find(
        (u: any) => u.username === username && u.password === password
      );

      if (user) {
        return reqInfo.utils.createResponse$(() => ({
          status: STATUS.OK,
          body: {
            token: 'fake-jwt-token-for-' + user.username,
            employeeId: user.id
          }
        }));
      }

      return reqInfo.utils.createResponse$(() => ({
        status: STATUS.UNAUTHORIZED,
        body: { message: 'Invalid credentials' }
      }));
    }
    return undefined;
  }
}
