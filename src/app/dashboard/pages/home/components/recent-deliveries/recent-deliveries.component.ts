import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Orders } from 'src/app/core/interfaces/order.interface';
import { OrdersService } from 'src/app/core/services/orders.service';
import { OrdersHelpers } from 'src/app/utils/orders/helpers';

@Component({
  selector: 'footiedrop-web-recent-deliveries',
  templateUrl: './recent-deliveries.component.html',
  styleUrls: ['./recent-deliveries.component.scss']
})
export class RecentDeliveriesComponent extends OrdersHelpers implements OnInit {
  orders: Orders = [];

  constructor(
    private ordersService: OrdersService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    // Fetch orders from the resolver, if available (pre-fetched data)
    // Otherwise, call fetchOrders to get the orders from the service
    this.orders = this.activatedRoute.snapshot.data["orders"] || [];
    this.orders = this.filterOrdersForOnlyCurrentDeliveries(this.orders);

    if (!this.orders.length) {
      this.fetchOrders();
    }
  }

  ngOnInit(): void { }

  fetchOrders(): void {
    this.ordersService.getOrders().subscribe((orders) => {
      this.orders = this.filterOrdersForOnlyCurrentDeliveries(orders);
    });
  }

  filterOrdersForOnlyCurrentDeliveries(orders: Orders): Orders {
    // Filter orders that are completed, cancelled, or failed, show maximum of 3 orders
    return orders.filter((order) => ["Delivered", "Cancelled", "Failed"].indexOf(order.status) !== -1).slice(0, 3);
  }
}
