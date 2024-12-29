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
  private subscribtion: Subscription[] = [];
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
  goToAddCategoryForm() {
    this.router.navigate(['admin/categories/add']);
  }
  goToEditCategoryForm(_id: string) {
    this.router.navigate(['admin/categories/', _id]);
  }
  deleteCategory(id: string) {
    let adminConfirm = confirm(
      'Are you sure you want to delete this category?'
    );
    if (!adminConfirm) return;
    let sub = this._CategoryService.deleteCategory(id).subscribe({
      next: (data) => {
        this.dataSource.data = this.dataSource.data.filter(
          (category) => category._id !== id
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
