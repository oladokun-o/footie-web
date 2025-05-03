import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, filter, interval, Observable, of, Subscription, switchMap } from 'rxjs';
import { Orders } from 'src/app/core/interfaces/order.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { UserService } from 'src/app/core/services/user.service';
import { selectAllOrders, selectOrdersLoadingState } from 'src/app/core/store/orders/orders.selectors';

@Component({
  selector: 'footiedrop-web-courier-home',
  templateUrl: './courier-home.component.html',
  styleUrls: ['./courier-home.component.scss'],
  animations: [
    trigger('slideInOut', [
      state(
        'offline',
        style({
          transform: 'translateY(-100%)', // Moves the element off-screen to the top
          opacity: 0, // Make it invisible
          height: '0', // Collapse the element to zero height
          overflow: 'hidden', // Hide any overflow during the collapse
        })
      ),
      state(
        'online',
        style({
          transform: 'translateY(0)', // Resets the position to its original spot
          opacity: 1, // Make it fully visible
          height: '*', // Allow it to expand to its natural height
        })
      ),
      transition('offline <=> online', [
        animate('0.5s ease-in-out'), // Smooth animation for both states
      ]),
    ]),
    trigger('stickyTop', [
      state(
        'offline',
        style({
          top: '-30px', // Stick to the top of the screen
          position: 'relative', // Allow it to scroll with the page
        })
      ),
      state(
        'online',
        style({
          top: '10px',
          position: 'relative',
        })
      ),
      transition('offline <=> online', [
        animate('0.5s ease-in-out'), // Smooth animation for both states
      ]),
    ]),
  ],
})
export class CourierHomeComponent implements AfterViewInit, OnDestroy, OnInit {
  get user(): User {
    return localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null;
  }

  get status(): string {
    return this.user.status === 'offline' ? 'Offline' : 'Online';
  }

  get warnings(): string[] {
    return this.user.warnings && this.user.warnings.length > 0 ? this.user.warnings : [];
  }

  get firstTruncatedWarning(): string {
    return this.warnings.length > 0 ? this.warnings[0].substring(0, 25) + '...' : '';
  }

  loading: boolean = false;
  private statusCheckInterval$: Subscription | null = null;

  latestOrdersFound: number = 0;

  orders$: Observable<Orders> = EMPTY;
  loading$: Observable<boolean> = EMPTY;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.orders$ = this.store.select(selectAllOrders);
    this.loading$ = this.store.select(selectOrdersLoadingState);

    // Set latest orders found
    this.orders$.subscribe(orders => {
      this.latestOrdersFound = orders.length;
    });
  }

  ngAfterViewInit(): void {
    this.setupTabVisibilityListener();
  }

  ngOnDestroy(): void {
    this.clearStatusCheckInterval();
  }

  private setupTabVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.startStatusCheck();
      } else {
        this.clearStatusCheckInterval();
      }
    });

    // Start immediately if tab is active
    if (document.visibilityState === 'visible') {
      this.startStatusCheck();
    }
  }

  private startStatusCheck(): void {
    this.clearStatusCheckInterval(); // Prevent multiple intervals

    this.statusCheckInterval$ = interval(5000)
      .pipe(
        filter(() => document.visibilityState === 'visible'), // Ensure tab is active
        switchMap(() => this.userService.getUserStatus())
      )
      .subscribe();
  }

  private clearStatusCheckInterval(): void {
    if (this.statusCheckInterval$) {
      this.statusCheckInterval$.unsubscribe();
      this.statusCheckInterval$ = null;
    }
  }

  toggleUserStatus(): void {
    const newStatus = this.user.status === 'offline' ? 'online' : 'offline';
    this.loading = true;
    this.userService.toggleUserStatus(newStatus).subscribe({
      next: (response) => {
        if (response.result === 'success') {
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error || 'An error occurred');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
