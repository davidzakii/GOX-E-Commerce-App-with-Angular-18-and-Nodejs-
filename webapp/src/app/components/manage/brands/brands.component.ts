import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Brand } from '../../../models/brand';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent {
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource = new MatTableDataSource<Brand>();
  private subscribtion: Subscription = new Subscription();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private router: Router, private _BrandService: BrandService) {}
  // showAlert() {
  //   Swal.fire({
  //     title: 'هل أنت متأكد؟',
  //     text: 'لا يمكنك التراجع عن هذا الإجراء!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'نعم، احذف!',
  //     cancelButtonText: 'إلغاء',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire('تم الحذف!', 'تم حذف العنصر بنجاح.', 'success');
  //     }
  //   });
  // }
  ngOnInit() {
    let sub = this._BrandService.getAllBrands().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
    });
    this.subscribtion.add(sub);
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
  goToAddBrandForm() {
    this.router.navigate(['admin/brands/add']);
  }
  goToEditBrandForm(_id: string) {
    this.router.navigate(['admin/brands/', _id]);
  }
  async deleteBrand(id: string): Promise<void> {
    let adminConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
    if (!adminConfirm.isConfirmed) return;
    let sub = this._BrandService.deleteBrand(id).subscribe({
      next: (data) => {
        this.dataSource.data = this.dataSource.data.filter(
          (brand) => brand._id !== id
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
