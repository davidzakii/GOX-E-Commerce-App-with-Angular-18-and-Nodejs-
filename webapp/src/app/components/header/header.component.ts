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
  categories: Category[] = [];
  private subscription: Subscription = new Subscription();
  private _CustomerService = inject(CustomerService);
  private _AuthService = inject(AuthService);
  private router = inject(Router);
  userName!: string;
  isUserLoggedIn!: boolean;
  isAdmin!: boolean;
  constructor() {
    let sub = this._AuthService.userLoggedAsObservable().subscribe({
      next: (res) => {
        this.userName = this._AuthService.userName;
        this.isAdmin = this._AuthService.isAdmin;
        this.isUserLoggedIn = res;
      },
    });
    this.subscription.add(sub);
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  ngOnInit() {
    const mediaQuery = window.matchMedia('(min-width:768px)');
    this.showIcon = !mediaQuery.matches;
    mediaQuery.addEventListener('change', (event) => {
      this.showIcon = !event.matches;
    });
    let sub = this._CustomerService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        alert(err.error.message);
      },
    });
    this.subscription.add(sub);
  }
  goToProfile() {
    const name = this.userName.split(' ').join('.');
    console.log(name);
    this.router.navigate(['/profile', name]);
  }
  onSearch($event: any) {
    if ($event.target.value) {
      this.router.navigateByUrl('/products?searchTerm=' + $event.target.value);
    }
  }
  searchCategory(caegoryId: string) {
    this.router.navigateByUrl('/products?categoryId=' + caegoryId);
  }
  logout() {
    this._AuthService.logout();
  }
  trackByIndex(index: number, caegory: Category) {
    return caegory._id;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
