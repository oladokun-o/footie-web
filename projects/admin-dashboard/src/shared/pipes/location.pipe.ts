import { Pipe, PipeTransform } from '@angular/core';
import { Address } from 'src/app/core/interfaces/order.interface';

@Pipe({
  name: 'addressTypeFilter'
})
export class AddressTypeFilterPipe implements PipeTransform {

  transform(addresses: Address[], type: 'pickup' | 'delivery'): Address[] {
    return addresses.filter(address => address.type === type);
  }
}
