import type { ActivatedRouteSnapshot, Resolve, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Orders } from '../interfaces/order.interface';
import { OrdersService } from '../services/orders.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersResolver implements Resolve<Orders> {
  constructor(private orderService: OrdersService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.orderService.getOrders();
  }
}
