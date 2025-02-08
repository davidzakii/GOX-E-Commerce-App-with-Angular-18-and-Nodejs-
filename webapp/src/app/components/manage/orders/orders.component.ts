import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VMOrder } from '../../../viewmodel/vmorder';
import { Subscription } from 'rxjs';
import { OrderService } from '../../../services/order.service';

import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscription = new Subscription();
  private orderServices = inject(OrderService);
  private router = inject(Router);
  displayedColumns: string[] = [
    'id',
    'userName',
    'items',
    'address',
    'paymentType',
    'totalAmount',
    'isPaid',
    'status',
    'createdAt',
    'updatedAt',
    'action',
  ];
  dataSource = new MatTableDataSource<VMOrder>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit() {
    const sub = this.orderServices.getOrders().subscribe({
      next: (orders) => {
        this.dataSource.data = orders;
      },
      error: (err) => {
        Swal.fire('Error!', err.message, 'error');
      },
    });
    this.subscription.add(sub);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  goToEditOrder(orderId: string) {
    this.router.navigate(['/admin/orders', orderId]);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
