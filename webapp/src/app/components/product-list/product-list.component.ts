import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { map, Subscription, switchMap } from 'rxjs';
import { Product } from '../../models/product';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(CustomerService);
  private subscription: Subscription = new Subscription();
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
          console.log(queryParams);
          return this.customerService
            .search(
              queryParams['searchTerm'] || '',
              queryParams['categoryId'] || '',
              queryParams['brandId'] || '',
              queryParams['page'] || '',
              queryParams['pageSize'] || '',
              queryParams['sortBy'] || 'price',
              queryParams['sortOrder'] || -1
            )
            .pipe(map((products) => products));
        })
      )
      .subscribe({
        next: (products) => {
          this.products = products;
        },
        error: (err) => {
          alert(err.error.message);
        },
      });
    this.subscription.add(sub);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
