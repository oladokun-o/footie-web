import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order, Orders, OrderStatus } from '../interfaces/order.interface';
import { mockData } from 'src/app/utils/orders/order.mock';
import { RequestResponse } from '../interfaces/index.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor() { }

  getOrders(): Observable<Orders> {
    return of(mockData.orders);
  }

  getOrder(id: string): Observable<Order | undefined> {
    return of(mockData.orders.find(order => order.id === id));
  }

  cancelOrder(id: string): Observable<RequestResponse> {
    const order = mockData.orders.find(order => order.id === id);
    if (order) {
      order.status = OrderStatus.Cancelled;
      return of({
        result: 'success',
        message: 'Order Cancelled Succesfully!',
        data: {
          order: order
        }
      });
    }
    return of({
      result: 'error',
      message: 'Order not found!',
      data: {}
    });
  }
}
