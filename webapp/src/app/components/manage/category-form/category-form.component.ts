import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  categoryName: string = '';
  Category: Category[] = [];
  id: string | undefined = undefined;
  private subscribtion: Subscription = new Subscription();
  private _CategoryService = inject(CategoryService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _Router = inject(Router);

  constructor() {
    // const sub = this._CategoryService.getAllCategories().subscribe({
    //   next: (result) => {
    //     this.Category = result;
    //   },
    // });
  }

  ngOnInit() {
    let sub = this._ActivatedRoute.params.subscribe({
      next: (params) => {
        this.id = params['id'];
        if (this.id) {
          this._CategoryService.getCategoryById(this.id).subscribe({
            next: (data) => {
              this.categoryName = data.name;
            },
            error: (err) => {
              this._Router.navigate(['/NotFoundPage']);
              // alert('Error:' + JSON.stringify(err.error.message));
            },
          });
        }
      },
    });
    this.subscribtion.add(sub);
  }
  submitCategory(categoryForm: any) {
    const newCategory = categoryForm.value;
    if (categoryForm.valid && this.id == undefined) {
      let sub = this._CategoryService.addNewCategory(newCategory).subscribe({
        next: (data) => {
          Swal.fire('Added!', JSON.stringify(data), 'success');
          this._Router.navigate(['/admin/categories']);
        },
        error: (err) => {
          Swal.fire('Error!', err.error.message, 'error');
        },
      });
      this.subscribtion.add(sub);
    } else if (categoryForm.valid && this.id != undefined) {
      let sub = this._CategoryService
        .updateCategory(newCategory, this.id)
        .subscribe({
          next: (data) => {
            Swal.fire('Updated!', data.message, 'success');
            this._Router.navigate(['/admin/categories']);
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
