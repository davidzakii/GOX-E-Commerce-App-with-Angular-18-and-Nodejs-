import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { Brand } from '../../models/brand';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: Product;
  categories: Category[] = [];
  brands: Brand[] = [];
  private subscription: Subscription = new Subscription();
  private _CustomerService = inject(CustomerService);
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

  addToCart() {
    console.log(this.product);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
