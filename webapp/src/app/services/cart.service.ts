import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../models/cart';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  productsInCart: BehaviorSubject<Cart[]> = new BehaviorSubject<Cart[]>([]);

  init() {
    return this.getProductsFromCart().subscribe({
      next: (cart) => {
        this.productsInCart.next(cart);
      },
      error: (err) => {},
    });
  }
  productsInCartAsObserva(): Observable<Cart[]> {
    return this.productsInCart.asObservable();
  }
  getProductsFromCart(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${environment.baseURL}/cart`);
  }

  addProductToCart(
    productId: string,
    quantity: number
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${environment.baseURL}/cart/addtocart/${productId}`,
      { quantity }
    );
  }

  removeProductFromCart(productId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${environment.baseURL}/cart/deletefromcart/${productId}`
    );
  }
}
