import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { map, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(CustomerService);
  private subscription: Subscription = new Subscription();
  ngOnInit() {
    // let sub = this.customerService.getCategories().subscribe({
    //   next: (categories) => {
    //     const ids = categories.map((category) => category._id);
    //     this.activatedRoute.queryParams.subscribe({
    //       next: (queryParams) => {
    //         if (!ids.includes(queryParams['category'])) {
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
          return this.customerService.getCategories().pipe(
            map((categories) => {
              const ids = categories.map((category) => category._id);
              const id = params['id'];
              return { ids, id };
            })
          );
        })
      )
      .subscribe({
        next: ({ids,id}) => {
          if(!ids.includes(id)){
            this.router.navigate(['/NotFoundPage'])
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
