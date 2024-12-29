import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
  private subscribtion: Subscription[] = [];
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
              alert('Error:' + JSON.stringify(err.error.message));
            },
          });
        }
      },
    });
    this.subscribtion.push(sub);
  }
  submitCategory(categoryForm: any) {
    const newCategory = categoryForm.value;
    if (categoryForm.valid && this.id == undefined) {
      let sub = this._CategoryService.addNewCategory(newCategory).subscribe({
        next: (data) => {
          alert(JSON.stringify(data) + ' Category added successfully');
          this._Router.navigate(['/admin/categories']);
        },
        error: (err) => {
          alert('Error:' + JSON.stringify(err.error.message));
        },
      });
      this.subscribtion.push(sub);
    } else if (categoryForm.valid && this.id != undefined) {
      let sub = this._CategoryService
        .updateCategory(newCategory, this.id)
        .subscribe({
          next: (data) => {
            alert(data.message);
            this._Router.navigate(['/admin/categories']);
          },
          error: (err) => {
            alert('Error:' + JSON.stringify(err.error.message));
          },
        });
      this.subscribtion.push(sub);
    } else {
      alert('Please fill all the fields correctly');
    }
  }

  ngOnDestroy() {
    this.subscribtion.forEach((sub) => sub.unsubscribe());
  }
}
