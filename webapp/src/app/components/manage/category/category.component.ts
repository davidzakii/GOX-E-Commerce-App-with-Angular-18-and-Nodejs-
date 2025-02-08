import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource = new MatTableDataSource<Category>();
  private subscribtion: Subscription = new Subscription();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private router: Router,
    private _CategoryService: CategoryService
  ) {}

  ngOnInit() {
    let sub = this._CategoryService.getAllCategories().subscribe({
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
  goToAddCategoryForm() {
    this.router.navigate(['admin/categories/add']);
  }
  goToEditCategoryForm(_id: string) {
    this.router.navigate(['admin/categories/', _id]);
  }
  async deleteCategory(id: string): Promise<void> {
    let adminConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
    if (!adminConfirm.isConfirmed) return;
    let sub = this._CategoryService.deleteCategory(id).subscribe({
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
