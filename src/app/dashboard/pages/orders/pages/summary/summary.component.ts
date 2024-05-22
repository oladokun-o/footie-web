import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Orders } from 'src/app/core/interfaces/order.interface';
import { OrdersService } from 'src/app/core/services/orders.service';
import { OrdersHelpers } from 'src/app/utils/orders/helpers';
import { NewOrderComponent } from '../../modals/new-order/new-order.component';

@Component({
  selector: 'footiedrop-web-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent extends OrdersHelpers implements OnInit {
  orders: Orders = [];

  constructor(
    private ordersService: OrdersService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    super();
    // Fetch orders from the resolver, if available (pre-fetched data)
    // Otherwise, call fetchOrders to get the orders from the service
    this.orders = this.activatedRoute.snapshot.data["orders"] || [];

    if (!this.orders.length) {
      this.fetchOrders();
    }
  }

  ngOnInit(): void { }

  fetchOrders(): void {
    this.ordersService.getOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  openNewOrderModal(): void {
    const ref = this.dialog.open(NewOrderComponent);
  }
}
