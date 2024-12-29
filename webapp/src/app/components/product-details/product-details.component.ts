import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private customerService = inject(CustomerService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private subscription: Subscription[] = [];
  ngOnInit() {
    let sub = this.customerService.getNewProducts().subscribe({
      next: (result) => {
        const ids = result.map((product) => product._id);
        this.activatedRoute.params.subscribe({
          next: (params) => {
            const id = params['id'];
            if (!ids.includes(id)) {
              this.router.navigate(['/NotFoundPage']);
            }
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.subscription.push(sub);
  }
  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
