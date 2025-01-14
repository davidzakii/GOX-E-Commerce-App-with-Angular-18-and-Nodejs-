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
  private subscription: Subscription = new Subscription();
  private _CustomerService = inject(CustomerService);
  private wishListService = inject(WishListService);
  private router = inject(Router);
  ngOnInit() {
    let sub1 = this._CustomerService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
    });
    let sub2 = this._CustomerService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
    });
    this.subscription.add(sub1);
    this.subscription.add(sub2);
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

  get sellingPrice() {
    return (
      this.product.price - (this.product.price * this.product.discount) / 100
    );
  }

  get getDiscountPercentage() {
    return Math.round(this.product.discount);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
