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
import { CartService } from '../../services/cart.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PReview } from '../../viewmodel/preview';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';

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
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private customerService = inject(CustomerService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private wishListService = inject(WishListService);
  private cartService = inject(CartService);
  private fb = inject(FormBuilder);
  private subscription: Subscription = new Subscription();
  product: Product = {
    _id: '',
    name: '',
    shortDescription: '',
    description: '',
    price: 0,
    discount: 0,
    quantity: 0,
    images: [''],
    categoryId: '',
    brandId: '',
    reviews: [
      {
        userId: '',
        comment: '',
        rating: 0,
      },
    ],
    _v: 0,
  };
  categoryName: string = '';
  brandName: string = '';
  baseURL = environment.baseURL;
  // id: string = '';
  mainImage: string = '';
  similerProducts: Product[] = [];
  isInWishList: boolean = false;
  isInCart: boolean = false;
  reviews: PReview[] = [];
  ratingOptions = [
    { value: 1, label: '1 - Poor' },
    { value: 2, label: '2 - Fair' },
    { value: 3, label: '3 - Good' },
    { value: 4, label: '4 - Very Good' },
    { value: 5, label: '5 - Excellent' },
  ];
  reviewForm = this.fb.group({
    comment: ['', [Validators.required, Validators.minLength(3)]],
    rating: [
      '',
      [
        Validators.required,
        Validators.min(1),
        Validators.max(5),
        Validators.pattern(/^[1-5]$/),
      ],
    ],
  });
  get comment() {
    return this.reviewForm.get('comment');
  }

  get rating() {
    return this.reviewForm.get('rating');
  }
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
              Swal.fire('Error!', err.error.message, 'error');
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
        ),
        switchMap((product) =>
          this.wishListService.productInWishListAsObservable().pipe(
            map((products) => {
              this.isInWishList = products.some(
                (product) => product._id == this.product._id
              );
              return product;
            }),
            catchError((err) => {
              Swal.fire('Error!', err.error.message, 'error');
              this.router.navigate(['/NotFoundPage']);
              return of(null);
            })
          )
        ),
        switchMap((product) =>
          this.cartService.productsInCartAsObserva().pipe(
            map((carts) => {
              this.isInCart = carts.some(
                (cart) => cart.product._id == this.product._id
              );
              return product;
            }),
            catchError((err) => {
              Swal.fire('Error!', err.error.message, 'error');
              this.router.navigate(['/NotFoundPage']);
              return of(null);
            })
          )
        ),
        switchMap((product) =>
          this.customerService.getReviews(this.product._id).pipe(
            map((res) => {
              this.reviews = res;
              return product;
            }),
            catchError((err) => {
              Swal.fire('Error!', err.error.message, 'error');
              this.router.navigate(['/NotFoundPage']);
              return of(null);
            })
          )
        )
      )
      .subscribe({
        next: () => {},
        error: (err) => {
          Swal.fire('Error!', err.error.message, 'error');
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
    if (this.isInWishList) {
      let sub = this.wishListService
        .deleteProductFromWishList(this.product._id)
        .subscribe({
          next: (res) => {
            if ('message' in res) {
              Swal.fire('Error!', 'Login First', 'error');
            } else {
              const sub = this.wishListService.init();
              this.subscription.add(sub);
            }
          },
          error: (err) => {
            Swal.fire('!', 'Please Login First', 'info');
          },
        });
      this.subscription.add(sub);
    } else {
      let sub = this.wishListService
        .addProductInWishList(this.product._id)
        .subscribe({
          next: (res) => {
            if ('message' in res) {
              Swal.fire('Error!', res.message, 'error');
            } else {
              const sub = this.wishListService.init();
              this.subscription.add(sub);
            }
          },
          error: (err) => {
            Swal.fire('Login!', 'Please Login first', 'info');
            this.router.navigate(['/login']);
          },
        });
      this.subscription.add(sub);
    }
  }
  addToCart() {
    if (this.isInCart) {
      const sub = this.cartService
        .removeProductFromCart(this.product._id)
        .subscribe({
          next: ({ message }) => {
            const sub = this.cartService.init();
            this.subscription.add(sub);
          },
          error: (err) => {
            Swal.fire('Login!', 'Please login first', 'info');
            this.router.navigate(['/login']);
          },
        });
      this.subscription.add(sub);
    } else {
      const sub = this.cartService
        .addProductToCart(this.product._id, 1)
        .subscribe({
          next: ({ message }) => {
            const sub = this.cartService.init();
            this.subscription.add(sub);
          },
          error: (err) => {
            Swal.fire('Login!', 'Please login first', 'info');
            this.router.navigate(['/login']);
          },
        });
      this.subscription.add(sub);
    }
  }

  submitReview() {
    const pReview: PReview = this.reviewForm.value as unknown as PReview;
    this.customerService
      .addProductReviews(pReview, this.product._id)
      .subscribe({
        next: (res) => {
          Swal.fire('Added!', 'Added review successfully', 'success');
        },
        error: (err) => {
          Swal.fire('Login!', 'Please login first', 'info');
          this.router.navigate(['/login']);
        },
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
