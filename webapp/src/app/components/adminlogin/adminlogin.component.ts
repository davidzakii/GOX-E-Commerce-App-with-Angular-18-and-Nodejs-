import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adminlogin',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './adminlogin.component.html',
  styleUrl: './adminlogin.component.scss',
})
export class AdminloginComponent implements OnDestroy {
  private subscribtion: Subscription = new Subscription();
  private _AuthService = inject(AuthService);
  private fb = inject(FormBuilder);
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  login() {
    let sub1 = this._AuthService
      .loginUser(this.loginForm.value as unknown as User)
      .subscribe({
        next: (res) => {
          if ('token' in res) {
            this._AuthService.login(res.token, res.user);
          }
        },
        error: (err) => {
          alert(err.error.message);
          console.log(err.error.message);
        },
      });
    this.subscribtion.add(sub1);
  }
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }
}
