import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { WishList } from '../models/wishList';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private http = inject(HttpClient);
  productsInWishList: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  init() {
    return this.getWishList().subscribe({
      next: (res) => {
        const productInWishList = res.products.map(
          (product) => product.productId
        );
        this.productsInWishList.next(productInWishList);
      },
      error: (err) => {
      },
    });
  }
  productInWishListAsObservable(): Observable<Product[]> {
    return this.productsInWishList.asObservable();
  }
  getWishList(): Observable<WishList> {
    return this.http.get<WishList>(`${environment.baseURL}/wishList`);
  }

  addProductInWishList(
    id: string
  ): Observable<WishList | { message: string; error: object }> {
    return this.http.post<WishList | { message: string; error: object }>(
      `${environment.baseURL}/wishList/addProduct/${id}`,
      {}
    );
  }

  deleteProductFromWishList(
    id: string
  ): Observable<WishList | { message: string; error: object }> {
    return this.http.delete<WishList | { message: string; error: object }>(
      `${environment.baseURL}/wishList/deleteProduct/${id}`
    );
  }
}
