import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WishListService } from '../../services/wish-list.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.scss',
})
export class WishListComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  private WishListService = inject(WishListService);
  productInWishList: Product[] = this.WishListService.productsInWishList.value;
  ngOnInit() {
    const sub = this.WishListService.productInWishListAsObservable().subscribe({
      next: (products) => {
        this.productInWishList = products;
      },
    });
    let sub2 = this.WishListService.init();
    this.subscription.add(sub);
    this.subscription.add(sub2);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
