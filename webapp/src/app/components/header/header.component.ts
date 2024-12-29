import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Category } from '../../models/category';
import { Subscription } from 'rxjs';
import { ArrowDirective } from '../../directives/arrow.directive';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    ArrowDirective,
    RouterLink,
    RouterLinkActive,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  caegories: Category[] = [];
  subscription: Subscription[] = [];
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
    this.subscription.push(sub);
  }
  ngOnInit() {
    let sub = this._CustomerService.getCategories().subscribe({
      next: (caegories) => {
        this.caegories = caegories;
      },
      error: (err) => {
        alert(err.error.message);
      },
    });
    this.subscription.push(sub);
  }
  goToProfile() {
    const name = this.userName.split(' ').join('.');
    console.log(name);
    this.router.navigate(['/profile', name]);
  }
  onSearch($event: any) {
    if ($event.target.value) {
      this.router.navigateByUrl('/products?search=' + $event.target.value);
    }
  }
  searchCategory(caegoryId: string) {
    this.router.navigateByUrl('/products?category=' + caegoryId);
  }
  logout() {
    this._AuthService.logout();
  }
  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
