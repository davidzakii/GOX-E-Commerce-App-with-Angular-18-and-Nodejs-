import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Category } from '../../models/category';
import { Subscription } from 'rxjs';
import { ArrowDirective } from '../../directives/arrow.directive';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ArrowDirective,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  showIcon = false;
  isUserLoggedIn!: boolean;
  isAdmin!: boolean;
  userName!: string;
  countProductInCart: number = 0;
  categories: Category[] = [];
  private subscription = new Subscription();
  private customerService = inject(CustomerService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  constructor() {}
  ngOnInit() {
    this.initUserState();
    this.setupResponsiveIcon();
    this.fetchCategories();
  }

  private initUserState() {
    const sub = this.authService.userLoggedAsObservable().subscribe({
      next: (isLoggedIn) => {
        this.isUserLoggedIn = isLoggedIn;
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Error!', err.error.message, 'error');
      },
    });
    const sub2 = this.authService.userNameAsObservable().subscribe({
      next: (name) => {
        this.userName = name;
      },
      error: (err) => {
        console.log(err);
      },
    });
    const sub3 = this.authService.isAdminAsObservable().subscribe({
      next: (isAdmin) => {
        this.isAdmin = isAdmin;
      },
      error: (err) => {
        console.log(err);
      },
    });
    const sub4 = this.cartService.productsInCartAsObserva().subscribe({
      next: (carts) => {
        this.countProductInCart = carts.reduce(
          (prevCartCount, currentCount) => prevCartCount + currentCount.count,
          0
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.subscription.add(sub);
    this.subscription.add(sub2);
    this.subscription.add(sub3);
    this.subscription.add(sub4);
  }

  private setupResponsiveIcon() {
    const mediaQuery = window.matchMedia('(min-width:768px)');
    this.showIcon = !mediaQuery.matches;
    mediaQuery.addEventListener('change', (event) => {
      this.showIcon = !event.matches;
    });
  }

  private fetchCategories() {
    const sub = this.customerService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error(err.error.message);
        Swal.fire('Error!', err.error.message, 'error');
      },
    });
    this.subscription.add(sub);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goToProfile() {
    const sanitizedUserName = this.userName.split(' ').join('.');
    this.router.navigate(['/profile', sanitizedUserName]);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.trim();
    if (searchTerm) {
      this.router.navigate(['/products'], { queryParams: { searchTerm } });
    }
  }

  searchCategory(categoryId: string) {
    this.router.navigate(['/products'], {
      queryParams: { categoryId },
    });
  }

  logout() {
    const sub = this.authService.logout();
    window.location.reload();
    this.subscription.add(sub);
  }

  trackByIndex(index: number, category: Category) {
    return category._id;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
