import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { map, Subscription, switchMap } from 'rxjs';
import { Product } from '../../models/product';
import { ProductCardComponent } from '../product-card/product-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../models/category';
import { Brand } from '../../models/brand';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ProductCardComponent,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(CustomerService);
  private subscription: Subscription = new Subscription();
  categories: Category[] = [];
  brands: Brand[] = [];
  selectedCategory: string = '';
  selectedBrand: string = '';
  order: string = '';
  page: number = 1;
  pageSize: number = 1;
  isNextPage: boolean = false;
  // ngOnInit() {
  //   // let sub = this.customerService.getCategories().subscribe({
  //   //   next: (categories) => {
  //   //     const ids = categories.map((category) => category._id);
  //   //     this.activatedRoute.queryParams.subscribe({
  //   //       next: (queryParams) => {
  //   //         if (!ids.includes(queryParams['category'])) {
  //   //           this.router.navigate(['/NotFoundPage']);
  //   //         }
  //   //       },
  //   //     });
  //   //   },
  //   //   error: (err) => {
  //   //     alert(err.error.message);
  //   //   },
  //   // });
  //   let sub = this.activatedRoute.queryParams
  //     .pipe(
  //       switchMap((queryParams) => {
  //         return this.customerService.getCategories().pipe(
  //           map((categories) => {
  //             const ids = categories.map((category) => category._id);
  //             const queryParam = queryParams['category'];
  //             return { ids, queryParam };
  //           })
  //         );
  //       })
  //     )
  //     .subscribe({
  //       next: ({ ids, queryParam }) => {
  //         if (!ids.includes(queryParam)) {
  //           this.router.navigate(['/NotFoundPage']);
  //         }
  //       },
  //       error: (err) => {
  //         alert(err.error.message);
  //       },
  //     });
  //   this.subscription.add(sub);
  // }
  products: Product[] = [];
  ngOnInit() {
    let sub = this.activatedRoute.queryParams
      .pipe(
        switchMap((queryParams) => {
          this.selectedCategory = queryParams['categoryId'];
          this.selectedBrand = queryParams['brandId'];
          this.page = queryParams['page'] || 1;
          this.pageSize = queryParams['pageSize'] || 10;
          return this.customerService
            .search(
              queryParams['searchTerm'] || '',
              queryParams['categoryId'] || '',
              queryParams['brandId'] || '',
              this.page,
              this.pageSize,
              queryParams['sortBy'] || 'price',
              queryParams['sortOrder'] || -1
            )
            .pipe(map((products) => products));
        })
      )
      .subscribe({
        next: (products) => {
          this.products = products;
          this.isNextPage = products.length < this.pageSize;
        },
        error: (err) => {
          alert(err.error.message);
        },
      });
    let sub1 = this.customerService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
    });
    let sub2 = this.customerService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
    });
    this.subscription.add(sub1);
    this.subscription.add(sub);
    this.subscription.add(sub2);
  }
  updateQueryParams(params: { [key: string]: any }) {
    const queryParams = {
      categoryId: this.selectedCategory,
      brandId: this.selectedBrand,
      sortOrder: this.order,
      page: this.page,
      pageSize: this.pageSize,
      ...params,
    };
    this.router.navigate(['/products'], { queryParams });
  }
  onCategoryChange() {
    this.router.navigate(['/products'], {
      queryParams: {
        categoryId: this.selectedCategory,
        brandId: this.selectedBrand,
      },
    });
  }
  onBrandChange() {
    this.page = 1;
    this.updateQueryParams({});
  }
  orderChange() {
    this.updateQueryParams({});
  }
  pageChangeNext() {
    this.page++;
    this.updateQueryParams({});
  }
  pageChangePrevious() {
    this.isNextPage = false;
    this.page--;
    this.updateQueryParams({});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
