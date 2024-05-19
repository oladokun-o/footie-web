import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/core/interfaces/order.interface';
import { OrdersService } from 'src/app/core/services/orders.service';
import { OrdersHelpers } from 'src/app/utils/orders/helpers';

@Component({
  selector: 'footiedrop-web-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent extends OrdersHelpers implements AfterViewInit {

  showButtonPickup: boolean = false;
  order: Order | undefined;

  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {
    super();
    this.route.params.subscribe(params => {
      this.getOrder(params['id']);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showButtonPickup = true;
    }, 2000);
  }

  getOrder(id: string): void {
    this.orderService.getOrder(id).subscribe(
      (order) => {
      this.order = order;

      if (!order) {
        this.toastr.error('Order not found!');
        this.router.navigate(['/dashboard/orders']);
      }
    },
    (error) => {
      this.toastr.error('Order not found');
      this.router.navigate(['/dashboard/orders']);
    });
  }

  onDragEvent(event: any): void {
    console.log(event);
  }
}
