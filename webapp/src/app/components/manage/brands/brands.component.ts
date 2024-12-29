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
  private subscribtion: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private router: Router, private _BrandService: BrandService) {}

  ngOnInit() {
    let sub = this._BrandService.getAllBrands().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
    });
    this.subscribtion.push(sub);
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
  deleteBrand(id: string) {
    let adminConfirm = confirm(
      'Are you sure you want to delete this category?'
    );
    if (!adminConfirm) return;
    let sub = this._BrandService.deleteBrand(id).subscribe({
      next: (data) => {
        this.dataSource.data = this.dataSource.data.filter(
          (brand) => brand._id !== id
        );
        alert(data.message);
      },
      error: (err) => {
        alert('Error:' + err.error.message);
      },
    });
    this.subscribtion.push(sub);
  }
  ngOnDestroy() {
    this.subscribtion.forEach((sub) => sub.unsubscribe());
  }
}
