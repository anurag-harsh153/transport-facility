import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleFilter',
  standalone: false
})
export class VehicleFilterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
