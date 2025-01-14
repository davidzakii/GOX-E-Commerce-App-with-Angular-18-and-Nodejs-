import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { map, Subscription, switchMap, catchError, of } from 'rxjs';
import { Product } from '../../models/product';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ProductCardComponent } from '../product-card/product-card.component';
import { MatButtonModule } from '@angular/material/button';
import { WishListService } from '../../services/wish-list.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    ProductCardComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private customerService = inject(CustomerService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private wishListService = inject(WishListService);
  private subscription: Subscription = new Subscription();
  product!: Product;
  categoryName: string = '';
  brandName: string = '';
  // id: string = '';
  mainImage: string = '';
  similerProducts: Product[] = [];
  ngOnInit() {
    /*let sub = this.customerService.getNewProducts().subscribe({
      next: (result) => {
        const ids = result.map((product) => product._id);
        this.activatedRoute.params.subscribe({
          next: (params) => {
            const id = params['id'];
            if (!ids.includes(id)) {
              this.router.navigate(['/NotFoundPage']);
            }
          },
        });
      },
      error: (err) => {
        alert(err.error.message);
      },
    });*/
    const sub = this.activatedRoute.params
      .pipe(
        switchMap((params) =>
          this.customerService.getProductById(params['id']).pipe(
            map((product) => {
              if (!product) {
                this.router.navigate(['/NotFoundPage']);
              }
              this.product = product!;
              this.mainImage = product.images[0];
              return product;
            }),
            catchError((err) => {
              console.error(err);
              this.router.navigate(['/NotFoundPage']);
              return of(null);
            })
          )
        ),
        switchMap((product) =>
          product
            ? this.customerService.getCategoryById(product.categoryId).pipe(
                map((category) => {
                  this.categoryName = category?.name || 'Unknown Category';
                  return product;
                })
              )
            : of(null)
        ),
        switchMap((product) =>
          product
            ? this.customerService.getBrandById(product.brandId).pipe(
                map((brand) => {
                  this.brandName = brand?.name || 'Unknown Brand';
                  return product;
                })
              )
            : of(null)
        ),
        switchMap((product) =>
          product
            ? this.customerService
                .search('', product.categoryId, '', 1, 4, '', -1)
                .pipe(
                  map((products) => {
                    this.similerProducts = products;
                    return product;
                  })
                )
            : of(null)
        )
      )
      .subscribe({
        next: () => {},
        error: (err) => {
          console.error(err);
        },
      });

    // let sub = this.activatedRoute.params.subscribe({
    //   next: (params) => {
    //     this.id = params['id'];
    //   },
    //   error: (err) => {
    //     alert(err);
    //   },
    // });
    // let sub2 = this.customerService
    //   .getProductById(this.id)
    //   .pipe(
    //     switchMap((product) => {
    //       if (product) {
    //         this.product = product;
    //         return this.customerService
    //           .getCategoryById(product.categoryId)
    //           .pipe(
    //             map((category) => {
    //               this.categoryName = category.name;
    //               return product;
    //             })
    //           );
    //       } else {
    //         this.router.navigate(['/NotFoundPage']);
    //         return product;
    //       }
    //     })
    //   )
    //   .subscribe({
    //     next: (product) => {
    //       console.log(product);
    //     },
    //   });
    this.subscription.add(sub);
    // this.subscription.add(sub2);
  }
  get sellingPrice() {
    return (
      this.product.price - (this.product.price * this.product.discount) / 100
    );
  }
  get getDiscountPercentage() {
    return Math.round(this.product.discount);
  }
  changeImage(url: string) {
    this.mainImage = url;
  }

  addToWishList() {
    if (this.isInWishList()) {
      let sub = this.wishListService
        .deleteProductFromWishList(this.product._id)
        .subscribe({
          next: (res) => {
            if ('message' in res) {
              alert(res.message);
            } else {
              let sub = this.wishListService.init();
              this.subscription.add(sub);
            }
          },
          error: (err) => {
            alert(err.error.message);
          },
        });
      this.subscription.add(sub);
    } else {
      let sub = this.wishListService
        .addProductInWishList(this.product._id)
        .subscribe({
          next: (res) => {
            if ('message' in res) {
              alert(res.message);
            } else {
              let sub = this.wishListService.init();
              this.subscription.add(sub);
            }
          },
          error: (err) => {
            alert('Please login first');
            this.router.navigate(['/login']);
          },
        });
      this.subscription.add(sub);
    }
  }

  isInWishList(): boolean {
    const isExist = this.wishListService.productInWishList.find(
      (product) => product._id === this.product._id
    );
    if (isExist) return true;
    else return false;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
