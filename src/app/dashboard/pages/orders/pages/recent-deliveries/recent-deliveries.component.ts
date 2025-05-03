import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, map, Observable } from 'rxjs';
import { Orders } from 'src/app/core/interfaces/order.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { selectAllOrders, selectOrdersLoadingState } from 'src/app/core/store/orders/orders.selectors';
import { OrdersHelpers } from 'src/app/utils/orders/helpers';

@Component({
  selector: 'footiedrop-web-recent-deliveries',
  templateUrl: './recent-deliveries.component.html',
  styleUrls: ['./recent-deliveries.component.scss']
})
export class RecentDeliveriesComponent extends OrdersHelpers implements OnInit {
  orders$: Observable<Orders> = EMPTY;
  loading$: Observable<boolean> = EMPTY;

  get user(): User {
    return localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null;
  }

  constructor(
    private store: Store
  ) {
    super();
  }

  ngOnInit(): void {
    // Select orders and loading state from the store
    this.orders$ = this.store.select(selectAllOrders).pipe(
      map((orders) => {
        let userOrders = orders.filter(
          (order) => order.courier?.id === this.user.id
        );
        return userOrders;
      })
    );
    this.loading$ = this.store.select(selectOrdersLoadingState);
  }

  filterForOnlyPendingOrders(orders: Orders): Orders {
    // Filter orders that are pending
    return orders.filter((order) => {
      return !["Delivered", "Cancelled", "Failed"].includes(order.status);
    }).slice(0, 3);
  }
}
