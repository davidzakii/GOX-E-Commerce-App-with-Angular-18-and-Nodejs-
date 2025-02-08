import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../models/product';
import { Subscription } from 'rxjs';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { WishListService } from '../../services/wish-list.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';
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
    rewind: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    nav: true,
    autoplay: true, // تشغيل تلقائي للسلايدر
    autoplayTimeout: 3000, // تحديد المدة بين كل انتقال
    autoplayHoverPause: true,
    autoHeight: true,
  };
  bannerImages: Product[] = [];
  newProducts: Product[] = [];
  featuredProducts: Product[] = [];
  baseURL = environment.baseURL;
  subscription: Subscription = new Subscription();
  private _CustomerService = inject(CustomerService);
  private wishListService = inject(WishListService);
  private cartService = inject(CartService);
  ngOnInit() {
    let sub1 = this._CustomerService.getNewProducts().subscribe({
      next: (products) => {
        this.newProducts = products;
        this.bannerImages.push(...products);
        this.customOptions = { ...this.customOptions };
      },
      error: (err) => {
        Swal.fire('Error!', err.error.message, 'error');
      },
    });
    let sub2 = this._CustomerService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products;
        this.bannerImages.push(...products);
      },
      error: (err) => {
        Swal.fire('Error!', err.error.message, 'error');
      },
    });
    let sub3 = this.wishListService.init();
    let sub4 = this.cartService.init();
    this.subscription.add(sub1);
    this.subscription.add(sub2);
    this.subscription.add(sub3);
    this.subscription.add(sub4);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
