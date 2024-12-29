import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Product } from '../../../models/product';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'name',
    'shortDescription',
    'price',
    'discount',
    'images',
    'categoryId',
    'brandId',
    'action',
  ];
  dataSource = new MatTableDataSource<Product>();
  private subscribtion: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private router: Router,
    private _ProductService: ProductService
  ) {}

  ngOnInit() {
    let sub = this._ProductService.getProducts().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
    });
    this.subscribtion.push(sub);
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
  goToAddProductForm() {
    this.router.navigate(['admin/products/add']);
  }
  goToEditProductForm(_id: string) {
    this.router.navigate(['admin/products/', _id]);
  }
  deleteProduct(id: string) {
    let adminConfirm = confirm(
      'Are you sure you want to delete this category?'
    );
    if (!adminConfirm) return;
    let sub = this._ProductService.deleteProduct(id).subscribe({
      next: (data) => {
        this.dataSource.data = this.dataSource.data.filter(
          (category) => category._id !== id
        );
        alert(data.message);
      },
      error: (err) => {
        alert('Error:' + err.error.message);
      },
    });
    this.subscribtion.push(sub);
  }
  ngOnDestroy() {
    this.subscribtion.forEach((sub) => sub.unsubscribe());
  }
}
