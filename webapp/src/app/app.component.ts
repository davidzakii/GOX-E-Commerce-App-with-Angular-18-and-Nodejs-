import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'GOX';
  private _AuthService = inject(AuthService);
  private subscription: Subscription = new Subscription();
  authInitialized = false;
  ngOnInit() {
    const sub = this._AuthService.checkSessionValidity().subscribe({
      next: (res) => {
        this.authInitialized = true;
      },
      error: (err) => {
        this.authInitialized = true;
      },
    });
    this.subscription.add(sub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
