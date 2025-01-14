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
  products: Product[] = [];
  ngOnInit() {
    let sub = this.WishListService.getWishList().subscribe({
      next: (res) => {
        let sub = this.WishListService.init();
        this.products = res.products.map((product) => product.productId);
        this.subscription.add(sub);
      },
    });
    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
