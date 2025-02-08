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
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment.development';
// import {
//   MatDialogActions,
//   MatDialogClose,
//   MatDialogContent,
// } from '@angular/material/dialog';

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
    MatIconModule,
    // MatDialogContent,
    // MatDialogActions,
    // MatDialogClose,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  brands: Brand[] = [];
  product: Product = {
    _id: '',
    name: '',
    shortDescription: '',
    description: '',
    price: 0,
    discount: 0,
    quantity: 0,
    images: [''],
    categoryId: '',
    brandId: '',
    reviews: [
      {
        userId: '',
        comment: '',
        rating: 0,
      },
    ],
    _v: 0,
  };
  id: string | undefined = undefined;
  baseURL: string = environment.baseURL;
  private subscribtion: Subscription = new Subscription();
  private _ProductService = inject(ProductService);
  private _CategoryServices = inject(CategoryService);
  private _BrandServices = inject(BrandService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _Router = inject(Router);
  private fb = inject(FormBuilder);
  private formData = new FormData();
  btnRemoveImageDisabled: boolean = true;
  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    shortDescription: ['', [Validators.required, Validators.minLength(10)]],
    description: ['', [Validators.required, Validators.minLength(50)]],
    price: ['', [Validators.required, Validators.pattern(/^\d{1,}$/)]],
    quantity: ['', [Validators.required, Validators.pattern(/^\d{1,}$/)]],
    discount: ['', [Validators.pattern(/^\d{1,}$/)]],
    images: this.fb.array([], [Validators.required]), // Start empty
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
  get quantity() {
    return this.productForm.get('quantity');
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
    if (this.images.length >= 5) return;
    this.images.push(this.fb.control([], [Validators.required]));
    this.btnRemoveImageDisabled = this.images.length <= 1;
  }
  onImagesSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files) {
      Array.from(inputElement.files).forEach((file) => {
        this.formData.append('images', file);
      });
    }
    // console.log(this.formData.getAll('images')); // طباعة للتأكد
  }
  // removeImage() {

  //   if (this.images.length > 0) {
  //     const files = Array.from(this.formData.getAll('images') as File[]);
  //     files.pop();
  //     this.formData.delete('images');
  //     files.forEach((file) => this.formData.append('images', file));
  //     this.images.removeAt(this.images.length - 1);
  //     this.btnRemoveImageDisabled = this.images.length <= 1;
  //   }
  // }
  removeImage(index: number) {
    const files = Array.from(this.formData.getAll('images') as File[]);
    files.splice(index, 1);
    this.formData.delete('images');
    files.forEach((file) => this.formData.append('images', file));
    this.images.removeAt(index);
    // console.log(this.formData.getAll('images'));
  }
  ngOnInit() {
    const sub = this._ActivatedRoute.params.subscribe({
      next: (params) => {
        this.id = params['id'];
        if (this.id) {
          this._ProductService.getProduct(this.id).subscribe({
            next: (product) => {
              // product.images.forEach((img) => this.addImage());
              // console.log(product.images);
              // console.log(product);
              this.product = product;
              this.productForm.patchValue({
                ...product,
                quantity: product.quantity.toString(),
                price: product.price.toString(),
                discount: product.discount?.toString() || '',
                isFeatured: !!product.isFeatured,
                isNewProduct: !!product.isNewProduct,
              });
              // product.images.forEach(() => this.addImage());
              this.images.patchValue(product.images);
              // console.log(this.productForm.value);
            },
            error: () => this._Router.navigate(['/NotFoundPage']),
          });
        }
      },
    });

    const sub2 = this._CategoryServices.getAllCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: (err) => Swal.fire('Error!', err.error.message, 'error'),
    });

    const sub3 = this._BrandServices.getAllBrands().subscribe({
      next: (brands) => (this.brands = brands),
    });

    this.subscribtion.add(sub);
    this.subscribtion.add(sub2);
    this.subscribtion.add(sub3);
  }
  submitProductForm() {
    if (this.id) {
      for (const key in this.productForm.value) {
        if (this.productForm.value.hasOwnProperty(key) && key !== 'images') {
          this.formData.append(
            key,
            this.productForm.get(key)?.value.toString() || ''
          );
        }
      }
      const sub = this._ProductService
        .updateProduct(this.id, this.formData)
        .subscribe({
          next: (data) => {
            Swal.fire('Updated!', data.message, 'success');
            this._Router.navigate(['/admin/products']);
          },
          error: (err) => {
            // console.log(err);
            Swal.fire('Error!', err.error.message, 'error');
          },
        });
      this.subscribtion.add(sub);
    } else {
      this.formData.append('name', this.name?.value || '');
      this.formData.append(
        'shortDescription',
        this.shortDescription?.value || ''
      );
      this.formData.append('description', this.description?.value || '');
      this.formData.append('price', this.price?.value || '');
      this.formData.append('quantity', this.quantity?.value || '');
      this.formData.append('discount', this.discount?.value || '');
      this.formData.append('categoryId', this.categoryId?.value || '');
      this.formData.append('brandId', this.brandId?.value || '');
      this.formData.append(
        'isFeatured',
        (this.productForm.get('isFeatured')?.value || '').toString()
      );
      this.formData.append(
        'isNewProduct',
        (this.productForm.get('isNewProduct')?.value || '').toString()
      );
      // console.log(this.formData.getAll('images'));
      // this.formData.forEach((value, key) => console.log(key, value));
      const sub = this._ProductService.addProduct(this.formData).subscribe({
        next: (data) => {
          Swal.fire('Added!', data.message, 'success');
          this._Router.navigate(['/admin/products']);
        },
        error: (err) => {
          Swal.fire('Error!', err.error.message, 'error');
        },
      });
      this.subscribtion.add(sub);
    }
  }

  showUpdateNote() {
    Swal.fire(
      'Note!',
      'To update a product, it must include at least one image, with the option to add between 1 to 5 images. Only the newly selected images will be kept, and the old ones will be deleted.you can add image by click on addImage button',
      'warning'
    );
  }

  showAddNote() {
    Swal.fire(
      'Note!',
      'To add a product, it must include at least one image, with the option to add between 1 to 5 images.you can add image by click on addImage button',
      'warning'
    );
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }
}
