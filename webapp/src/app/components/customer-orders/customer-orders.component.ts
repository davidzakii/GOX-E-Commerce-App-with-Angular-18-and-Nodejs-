import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Subscription } from 'rxjs';
import { VMOrder } from '../../viewmodel/vmorder';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CurrencyPipe,
  DatePipe,
} from '@angular/common';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule, CurrencyPipe],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.scss',
})
export class CustomerOrdersComponent implements OnInit, OnDestroy {
  orders: VMOrder[] = [];
  private subscribtion: Subscription = new Subscription();
  private orderService = inject(OrderService);
  baseURL = environment.baseURL;
  ngOnInit() {
    const sub = this.orderService.getCustomerOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (err) => {
        console.log(err.error);
        Swal.fire('Error!', err.error.message, 'error');
      },
    });
  }

  mathRound(i: number): number {
    return Math.round(i);
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }
}
