import { VehicleType } from "./vehicle-type.enum";

export interface Ride {
  id: string;
  employeeId: string;
  vehicleType: VehicleType;
  vehicleNo: string;
  vacantSeats: number;
  time: string;
  pickupPoint: string;
  destination: string;
  bookedEmployeeIds: string[];
}