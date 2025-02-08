import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Product } from '../../../models/product';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Category } from '../../../models/category';
import { Brand } from '../../../models/brand';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { environment } from '../../../../environments/environment.development';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    // MatDialogModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  // readonly dialog = inject(MatDialog);
  // openDialog() {
  //   const dialogRef = this.dialog.open(ProductFormComponent);
  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }
  displayedColumns: string[] = [
    'id',
    'name',
    'shortDescription',
    'price',
    'discount',
    'quantity',
    'images',
    'categoryId',
    'brandId',
    'action',
  ];
  baseURL = environment.baseURL;
  isPopupVisible: boolean = false;
  categories: Category[] = [];
  brands: Brand[] = [];
  images: string[] = [];
  dataSource = new MatTableDataSource<Product>();
  private subscribtion: Subscription = new Subscription();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private router: Router,
    private _ProductService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  showImagesPopup(images: string[]): void {
    this.images = images;
    this.isPopupVisible = true;
  }

  closePopup(): void {
    this.isPopupVisible = false;
    this.images = [];
  }

  ngOnInit() {
    let sub = this._ProductService.getProducts().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
    });
    let sub2 = this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        Swal.fire('Error!', err.error.message, 'error');
      },
    });
    let sub3 = this.brandService.getAllBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (err) => {
        Swal.fire('Error!', err.error.message, 'error');
      },
    });
    this.subscribtion.add(sub);
    this.subscribtion.add(sub2);
    this.subscribtion.add(sub3);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  goToAddProductForm() {
    // this.openDialog();
    this.router.navigate(['admin/products/add']);
  }
  goToEditProductForm(_id: string) {
    this.router.navigate(['admin/products/', _id]);
  }
  async deleteProduct(id: string): Promise<void> {
    let adminConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
    if (!adminConfirm.isConfirmed) return;
    let sub = this._ProductService.deleteProduct(id).subscribe({
      next: (data) => {
        this.dataSource.data = this.dataSource.data.filter(
          (category) => category._id !== id
        );
        Swal.fire('Deleted!', data.message, 'success');
      },
      error: (err) => {
        Swal.fire('Error!', err.error.message, 'error');
      },
    });
    this.subscribtion.add(sub);
  }
  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }
}
