import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../models/product';
import { Subscription } from 'rxjs';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { WishListService } from '../../services/wish-list.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCardComponent, RouterLink, CarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    nav: true,
  };
  bannerImages: Product[] = [];
  newProducts: Product[] = [];
  featuredProducts: Product[] = [];
  subscription: Subscription = new Subscription();
  private _CustomerService = inject(CustomerService);
  private wishListService = inject(WishListService);
  ngOnInit() {
    let sub1 = this._CustomerService.getNewProducts().subscribe({
      next: (products) => {
        this.newProducts = products;
        this.bannerImages.push(...products);
      },
    });
    let sub2 = this._CustomerService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products;
        this.bannerImages.push(...products);
      },
    });
    let sub3 = this.wishListService.init();
    this.subscription.add(sub1);
    this.subscription.add(sub2);
    this.subscription.add(sub3);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
