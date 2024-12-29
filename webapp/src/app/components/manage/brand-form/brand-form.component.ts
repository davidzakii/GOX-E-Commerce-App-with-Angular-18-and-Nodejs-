import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { BrandService } from '../../../services/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  constructor() {}

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
              alert('Error:' + JSON.stringify(err.error.message));
            },
          });
        }
      },
    });
    this.subscribtion.add(sub);
  }
  submitBrand(brandForm: any) {
    const newCategory = brandForm.value;
    if (brandForm.valid && this.id == undefined) {
      let sub = this._BrandService.addNewBrand(newCategory).subscribe({
        next: (data) => {
          alert(JSON.stringify(data) + ' Brand added successfully');
          this._Router.navigate(['/admin/brands']);
        },
        error: (err) => {
          alert('Error:' + JSON.stringify(err.error.message));
        },
      });
      this.subscribtion.add(sub);
    } else if (brandForm.valid && this.id != undefined) {
      let sub = this._BrandService.updateBrand(newCategory, this.id).subscribe({
        next: (data) => {
          alert(data.message);
          this._Router.navigate(['/admin/brands']);
        },
        error: (err) => {
          alert('Error:' + JSON.stringify(err.error.message));
        },
      });
      this.subscribtion.add(sub);
    } else {
      alert('Please fill all the fields correctly');
    }
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe()
  }
}
