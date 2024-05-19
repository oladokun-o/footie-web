import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Orders } from '../interfaces/order.interface';
import { mockOrders } from 'src/app/utils/orders/order.mock';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor() { }

  getOrders(): Observable<Orders> {
    return of(mockOrders);
  }
}
