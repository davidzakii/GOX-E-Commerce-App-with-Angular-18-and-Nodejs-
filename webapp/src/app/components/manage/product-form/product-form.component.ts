import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { MatSelectModule } from '@angular/material/select';
import { Brand } from '../../../models/brand';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  brands: Brand[] = [];
  id: string | undefined = undefined;
  private subscribtion: Subscription = new Subscription();
  private _ProductService = inject(ProductService);
  private _CategoryServices = inject(CategoryService);
  private _BrandServices = inject(BrandService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _Router = inject(Router);
  private fb = inject(FormBuilder);
  btnRemoveImageDisabled: boolean = true;
  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    shortDescription: ['', [Validators.required, Validators.minLength(10)]],
    description: ['', [Validators.required, Validators.minLength(50)]],
    price: ['', [Validators.required, Validators.pattern(/^\d{1,}$/)]],
    discount: ['', [Validators.pattern(/^\d{1,}$/)]],
    images: this.fb.array([
      this.fb.control('', [Validators.required, Validators.minLength(5)]),
    ]),
    categoryId: ['', [Validators.required, Validators.minLength(16)]],
    brandId: ['', [Validators.required, Validators.minLength(16)]],
    isFeatured: [false],
    isNewProduct: [false],
  });
  constructor() {}

  get name() {
    return this.productForm.get('name');
  }
  get shortDescription() {
    return this.productForm.get('shortDescription');
  }
  get description() {
    return this.productForm.get('description');
  }
  get price() {
    return this.productForm.get('price');
  }
  get discount() {
    return this.productForm.get('discount');
  }
  get images() {
    return this.productForm.get('images') as FormArray;
  }
  get categoryId() {
    return this.productForm.get('categoryId');
  }
  get brandId() {
    return this.productForm.get('brandId');
  }
  addImage() {
    if (this.images.length > 0) {
      this.btnRemoveImageDisabled = false;
    } else {
      this.btnRemoveImageDisabled = true;
    }
    this.images.push(
      this.fb.control('', [Validators.required, Validators.minLength(5)])
    );
  }
  removeImage() {
    if (this.images.length - 1 > 1) {
      this.btnRemoveImageDisabled = false;
    } else {
      this.btnRemoveImageDisabled = true;
    }
    this.images.removeAt(this.images.length - 1);
  }
  ngOnInit() {
    let sub = this._ActivatedRoute.params.subscribe({
      next: (params) => {
        this.id = params['id'];
        if (this.id) {
          this._ProductService.getProduct(this.id).subscribe({
            next: (product) => {
              for (let i = 0; i < product.images.length - 1; i++) {
                this.addImage();
              }
              this.productForm.patchValue({
                ...product,
                price: product.price.toString(),
                discount: product.discount?.toString() || '',
                isFeatured: !!product.isFeatured,
                isNewProduct: !!product.isNewProduct,
              });
            },
            error: (err) => {
              this._Router.navigate(['/NotFoundPage']);
            },
          });
        }
      },
    });
    let sub2 = this._CategoryServices.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        alert(err.error.message);
      },
    });
    let sub3 = this._BrandServices.getAllBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
    });
    this.subscribtion.add(sub);
    this.subscribtion.add(sub2);
    this.subscribtion.add(sub3);
  }
  submitProductForm() {
    if (this.id) {
      let sub1 = this._ProductService
        .updateProduct(this.id, this.productForm.value as unknown as Product)
        .subscribe({
          next: (data) => {
            alert(data.message);
            this._Router.navigate(['/admin/products']);
          },
          error: (err) => {
            alert(err.error.message);
          },
        });
      this.subscribtion.add(sub1);
    } else {
      let sub2 = this._ProductService
        .addProduct(this.productForm.value as unknown as Product)
        .subscribe({
          next: (data) => {
            alert(data.message + JSON.stringify(data.product));
            this._Router.navigate(['/admin/products']);
          },
          error: (err) => {
            alert(err.error.message);
          },
        });
      this.subscribtion.add(sub2);
    }
  }
  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }
}
