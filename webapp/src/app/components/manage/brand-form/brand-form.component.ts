import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { BrandService } from '../../../services/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss',
})
export class BrandFormComponent {
  brandName: string = '';
  id: string | undefined = undefined;
  private subscribtion: Subscription = new Subscription();
  private _BrandService = inject(BrandService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _Router = inject(Router);

  ngOnInit() {
    let sub = this._ActivatedRoute.params.subscribe({
      next: (params) => {
        this.id = params['id'];
        if (this.id) {
          this._BrandService.getBrandById(this.id).subscribe({
            next: (data) => {
              this.brandName = data.name;
            },
            error: (err) => {
              this._Router.navigate(['/NotFoundPage']);
              // alert('Error:' + JSON.stringify(err.error.message));
            },
          });
        }
      },
    });
    // let sub1 = this._ActivatedRoute.params
    //   .pipe(
    //     switchMap((params) => {
    //       this.id = params['id'];
    //       return this._BrandService.getAllBrands().pipe(
    //         map((brands) => {
    //           const ids = brands.map((brand) => brand._id);
    //           return { ids, brands };
    //         })
    //       );
    //     })
    //   )
    //   .subscribe({
    //     next: ({ ids, brands }) => {
    //       if (!ids.includes(this.id!)) this._Router.navigate(['/NotFoundPage']);
    //       else {
    //         let brand = brands.find((brand) => brand._id == this.id);
    //         this.brandName = brand!.name;
    //       }
    //       // if (typeof brand !== 'string') {
    //       //   // this.brandName = brand.name;
    //       // } else this._Router.navigate(['/NotFoundPage']);
    //     },
    //     error: (err) => {
    //       alert(err.error.message);
    //     },
    //   });
    this.subscribtion.add(sub);
    // this.subscribtion.add(sub1);
  }
  submitBrand(brandForm: any) {
    const newCategory = brandForm.value;
    if (brandForm.valid && this.id == undefined) {
      let sub = this._BrandService.addNewBrand(newCategory).subscribe({
        next: (data) => {
          Swal.fire('Added!', JSON.stringify(data), 'success');
          this._Router.navigate(['/admin/brands']);
        },
        error: (err) => {
          Swal.fire('Error!', err.error.message, 'error');
        },
      });
      this.subscribtion.add(sub);
    } else if (brandForm.valid && this.id != undefined) {
      let sub = this._BrandService.updateBrand(newCategory, this.id).subscribe({
        next: (data) => {
          Swal.fire('Updated!', data.message, 'success');
          this._Router.navigate(['/admin/brands']);
        },
        error: (err) => {
          Swal.fire('Error!', err.error.message, 'error');
        },
      });
      this.subscribtion.add(sub);
    } else {
      Swal.fire(
        'Please be focus for fields!',
        'Please fill all the fields correctly',
        'success'
      );
    }
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }
}
