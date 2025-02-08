import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { map, Subscription, switchMap } from 'rxjs';
import { OrderService } from '../../../services/order.service';
import { VMOrder } from '../../../viewmodel/vmorder';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment.development';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-update-order',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    DatePipe,
    CurrencyPipe,
    RouterLink,
    MatButtonToggleModule,
  ],
  templateUrl: './update-order.component.html',
  styleUrl: './update-order.component.scss',
})
export class UpdateOrderComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private orderServices = inject(OrderService);
  private activateRoute = inject(ActivatedRoute);
  baseURL = environment.baseURL;
  order: VMOrder = {
    id: '',
    userId: {
      _id: '',
      name: '',
    },
    items: [],
    address: {
      address1: '',
      phoneNumber: '',
      city: '',
      postalCode: 0,
    },
    totalAmount: 0,
    paymentType: '',
    status: '',
    isPaid: false,
  };
  ngOnInit() {
    const orderId = this.activateRoute.snapshot.paramMap.get('id');
    if (orderId) {
      const sub = this.orderServices.getOrderById(orderId).subscribe({
        next: (res) => {
          this.order = res;
        },
        error: (err) => {
          Swal.fire('Error!', err.error.message, 'error');
        },
      });
      this.subscription.add(sub);
    }
  }
  statusChange(event: any) {
    const sub = this.activateRoute.paramMap
      .pipe(
        switchMap((param) => {
          const id = param.get('id') || '';
          return this.orderServices.updateOrderStatus(id, event.value).pipe(
            map((res) => {
              return res;
            })
          );
        })
      )
      .subscribe({
        next: (res) => {
          Swal.fire(
            'Edit Order Status Successfully!',
            JSON.stringify(res),
            'success'
          );
        },
        error: (err) => {
          console.log(err);
          Swal.fire('Error!', err.message, 'error');
        },
      });
    this.subscription.add(sub);
  }
  paidChange(event: any) {
    const sub = this.activateRoute.paramMap
      .pipe(
        switchMap((param) => {
          const id = param.get('id') || '';
          return this.orderServices.updateOrderPaid(id, event.value).pipe(
            map((res) => {
              return res;
            })
          );
        })
      )
      .subscribe({
        next: (res) => {
          Swal.fire(
            'Edit Order Paid Successfully!',
            JSON.stringify(res),
            'success'
          );
        },
        error: (err) => {
          console.log(err);
          Swal.fire('Error!', err.message, 'error');
        },
      });
    this.subscription.add(sub);
  }
  mathRound(i: number): number {
    return Math.round(i);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
