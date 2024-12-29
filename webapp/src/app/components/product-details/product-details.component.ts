import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { map, Subscription, switchMap } from 'rxjs';

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
  private subscription: Subscription = new Subscription();
  ngOnInit() {
    // let sub = this.customerService.getNewProducts().subscribe({
    //   next: (result) => {
    //     const ids = result.map((product) => product._id);
    //     this.activatedRoute.params.subscribe({
    //       next: (params) => {
    //         const id = params['id'];
    //         if (!ids.includes(id)) {
    //           this.router.navigate(['/NotFoundPage']);
    //         }
    //       },
    //     });
    //   },
    //   error: (err) => {
    //     alert(err.error.message);
    //   },
    // });
    let sub = this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          return this.customerService.getNewProducts().pipe(
            map((result) => {
              const ids = result.map((product) => product._id);
              const id = params['id'];
              return { ids, id };
            })
          );
        })
      )
      .subscribe({
        next: ({ ids, id }) => {
          if (!ids.includes(id)) {
            this.router.navigate(['/NotFoundPage']);
          }
        },
        error: (err) => {
          alert(err.error.message);
        },
      });
    this.subscription.add(sub);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
