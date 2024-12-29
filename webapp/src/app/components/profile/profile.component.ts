import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  private authService = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  userName: string = '';
  ngOnInit() {
    let sub = this.activatedRoute.params.subscribe({
      next: (param) => {
        this.userName = param['username'];
        if (this.userName !== this.authService.userName.split(' ').join('.')) {
          this.router.navigate(['/NotFoundPage']);
        }
      },
    });
    this.subscription.push(sub);
  }
  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}