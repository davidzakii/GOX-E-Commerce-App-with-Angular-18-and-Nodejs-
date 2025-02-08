import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { Brand } from '../../models/brand';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { WishListService } from '../../services/wish-list.service';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    CurrencyPipe,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: Product;
  categories: Category[] = [];
  brands: Brand[] = [];
  isInWishList: boolean = false;
  isInCart: boolean = false;
  productRating: number = 0;
  baseURL = environment.baseURL;
  private subscription: Subscription = new Subscription();
  private _CustomerService = inject(CustomerService);
  private wishListService = inject(WishListService);
  private cartService = inject(CartService);
  private router = inject(Router);
  ngOnInit() {
    let sub1 = this._CustomerService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        Swal.fire('Error!', JSON.stringify(err), 'error');
      },
    });
    let sub2 = this._CustomerService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (err) => {
        Swal.fire('Error!', JSON.stringify(err), 'error');
      },
    });
    const sub3 = this.wishListService
      .productInWishListAsObservable()
      .subscribe({
        next: (products) => {
          this.isInWishList = products.some(
            (product) => product._id === this.product._id
          );
        },
        error: (err) => {
          Swal.fire('Error!', JSON.stringify(err), 'error');
        },
      });
    const sub4 = this.cartService.productsInCartAsObserva().subscribe({
      next: (carts) => {
        this.isInCart = carts.some(
          (cart) => cart.product._id === this.product._id
        );
      },
      error: (err) => {
        Swal.fire('Error!', JSON.stringify(err), 'error');
      },
    });
    const sub5 = this._CustomerService
      .getProductRating(this.product._id)
      .subscribe({
        next: (res) => {
          this.productRating = res.totalRating;
        },
        error: (err) => {
          Swal.fire('Error!', JSON.stringify(err.error.message), 'error');
        },
      });
    this.subscription.add(sub1);
    this.subscription.add(sub2);
    this.subscription.add(sub3);
    this.subscription.add(sub4);
    this.subscription.add(sub5);
  }

  addToWishList() {
    if (this.isInWishList) {
      let sub = this.wishListService
        .deleteProductFromWishList(this.product._id)
        .subscribe({
          next: (res) => {
            if ('message' in res) {
              Swal.fire('Error!', res.message, 'error');
            } else {
              const sub = this.wishListService.init();
              this.subscription.add(sub);
              Swal.fire(
                'Deleted!',
                'Deleted from wishlist successfully',
                'success'
              );
            }
          },
          error: (err) => {
            Swal.fire('Error!', JSON.stringify(err), 'error');
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
              Swal.fire('Added!', 'Added to wishlist successfully', 'success');
            }
          },
          error: (err) => {
            Swal.fire(
              'Please login to access your wish list !',
              'Please login first',
              'info'
            );
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
            Swal.fire('Deleted!', message, 'success');
          },
          error: (err) => {
            Swal.fire('Error!', JSON.stringify(err), 'error');
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
            Swal.fire('Added!', message, 'success');
          },
          error: (err) => {
            Swal.fire(
              'Login to access your cart!',
              'Please login first',
              'info'
            );
            this.router.navigate(['/login']);
          },
        });
      this.subscription.add(sub);
    }
  }

  get sellingPrice() {
    return (
      this.product.price - (this.product.price * this.product.discount) / 100
    );
  }

  mathFloor(i: number) {
    return Math.floor(i);
  }

  get getDiscountPercentage() {
    return Math.round(this.product.discount);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
