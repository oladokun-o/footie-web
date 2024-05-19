import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order, Orders } from '../interfaces/order.interface';
import { mockOrders } from 'src/app/utils/orders/order.mock';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor() { }

  getOrders(): Observable<Orders> {
    return of(mockOrders);
  }

  getOrder(id: string): Observable<Order | undefined> {
    return of(mockOrders.find(order => order.id === id));
  }
}
