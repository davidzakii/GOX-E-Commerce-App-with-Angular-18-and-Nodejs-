import {
  AfterViewInit,
  Component,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { Subscription, firstValueFrom } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Cart } from '../../models/cart';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { OrderService } from '../../services/order.service';
import { environment } from '../../../environments/environment.development';
import { PaypalService } from '../../services/paypal.service';
import Swal from 'sweetalert2';
import { loadScript } from '@paypal/paypal-js';
@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    ReactiveFormsModule,
    MatRadioModule,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  carts: Cart[] = [];
  totalPrice!: number;
  orderStep: number = 0;
  paymentType = 'cash';
  baseURL: string = environment.baseURL;
  isPayPalButtonLoaded: boolean = false;
  private subscription: Subscription = new Subscription();
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private paypalServices = inject(PaypalService);
  addressForm = this.fb.group({
    address1: ['', [Validators.required]],
    address2: [''],
    phoneNumber: ['', [Validators.required]],
    city: ['', [Validators.required]],
    postalcode: ['', [Validators.required]],
  });
  ngOnInit() {
    const sub = this.cartService.productsInCartAsObserva().subscribe({
      next: (carts) => {
        this.carts = carts;
        this.totalPrice = this.carts.reduce(
          (prevPrice, currentProductPrice) =>
            prevPrice +
            (currentProductPrice.count * currentProductPrice.product.price -
              (currentProductPrice.count *
                currentProductPrice.product.price *
                currentProductPrice.product.discount) /
                100),
          0
        );
      },
      error: (err) => {
        Swal.fire('Error!', err.error, 'error');
      },
    });
  }

  get address1() {
    return this.addressForm.get('address1');
  }
  get address2() {
    return this.addressForm.get('address2');
  }
  get phoneNumber() {
    return this.addressForm.get('phoneNumber');
  }
  get city() {
    return this.addressForm.get('city');
  }
  get postalcode() {
    return this.addressForm.get('postalcode');
  }
  mathRound(i: number): number {
    return Math.round(i);
  }

  checkout() {
    this.orderStep = 1;
  }

  removeProductFromCart(productId: string) {
    const sub = this.cartService.removeProductFromCart(productId).subscribe({
      next: ({ message }) => {
        const sub = this.cartService.init();
        this.subscription.add(sub);
      },
      error: (err) => {
        Swal.fire('Error!', err.error.message, 'error');
      },
    });
  }

  decreaseQuantity(productId: string, i: number) {
    const sub = this.cartService.addProductToCart(productId, i).subscribe({
      next: ({ message }) => {
        const sub = this.cartService.init();
        this.subscription.add(sub);
      },
      error: (err) => {
        Swal.fire('Error!', err.error.message, 'error');
      },
    });
  }

  increaseQuantity(productId: string, i: number) {
    const sub = this.cartService.addProductToCart(productId, i).subscribe({
      next: ({ message }) => {
        const sub = this.cartService.init();
        this.subscription.add(sub);
      },
      error: (err) => {
        Swal.fire('Error!', err.error.message, 'error');
      },
    });
  }

  addAddress() {
    this.orderStep = 2;
  }

  completeOrder() {
    let items = this.carts.map((cart) => ({
      quantity: cart.count,
      productId: cart.product._id,
    }));
    let order = {
      items,
      address: {
        address1: this.address1?.value || '',
        address2: this.address2?.value || '',
        phoneNumber: this.phoneNumber?.value || '',
        city: this.city?.value || '',
        postalCode: Number(this.postalcode?.value) || 0,
      },
      paymentType: this.paymentType,
      totalAmount: Math.round(this.totalPrice),
    };

    if (this.paymentType === 'cash') {
      const sub = this.orderService.addOrder(order).subscribe({
        next: (res) => {
          Swal.fire('Success!', 'Order created', 'success');
          this.cartService.productsInCart.next([]);
          this.orderStep = 0;
          this.router.navigate(['/order']);
        },
        error: (err) => {
          Swal.fire('Error!', err.error.error, 'error');
        },
      });
      this.subscription.add(sub);
    } else if (this.paymentType === 'card') {
      this.orderStep = 3;
    }
  }

  pay() {
    if (this.paymentType === 'paypal') {
      this.orderStep = 4;
      setTimeout(() => {
        this.initPayPal();
      }, 500);
    }
    if (this.paymentType === 'stripe') {
      Swal.fire('Soon!', 'Sorry we will add it soon', 'info');
    }
  }

  async initPayPal() {
    try {
      const paypal = await loadScript({
        clientId:
          'ATXmUr87KgxAtwyVWFwnkfaz1-xH-hZzwQebTOpJtfmqFv_DJg8W5T6aj3R8EcXnzVkSWcNlqyR1BXvQ',
      });

      if (!paypal) {
        console.error('PayPal SDK Not Loaded');
        return;
      }

      if (paypal && paypal.Buttons) {
        paypal
          .Buttons({
            createOrder: async (data, actions) => {
              try {
                const cost = Math.round(this.totalPrice / 50).toString();
                const order = await firstValueFrom(
                  this.paypalServices.createPayment(cost, 'USD')
                );
                return order.id;
              } catch (error) {
                Swal.fire(
                  'Error create payment!',
                  JSON.stringify(error),
                  'error'
                );
              }
            },
            onApprove: async (data, actions) => {
              try {
                const details = await firstValueFrom(
                  this.paypalServices.capturePayment(data.orderID)
                );
                Swal.fire(
                  'Successfully order',
                  'Transaction completed successfully, thank you!',
                  'success'
                );
                let items = this.carts.map((cart) => ({
                  quantity: cart.count,
                  productId: cart.product._id,
                }));
                let order = {
                  items,
                  address: {
                    address1: this.address1?.value || '',
                    address2: this.address2?.value || '',
                    phoneNumber: this.phoneNumber?.value || '',
                    city: this.city?.value || '',
                    postalCode: Number(this.postalcode?.value) || 0,
                  },
                  paymentType: this.paymentType,
                  totalAmount: Math.round(this.totalPrice),
                  isPaid: true,
                };
                const sub = this.orderService.addOrder(order).subscribe({
                  next: (res) => {
                    Swal.fire('Success!', 'Order created', 'success');
                    this.cartService.productsInCart.next([]);
                    this.orderStep = 0;
                    this.router.navigate(['/order']);
                  },
                  error: (err) => {
                    Swal.fire('Error!', err.error.error, 'error');
                  },
                });
                this.subscription.add(sub);
              } catch (error) {
                Swal.fire(
                  'Error capture payment!',
                  JSON.stringify(error),
                  'error'
                );
              }
            },
            onError: (err) => {
              Swal.fire('Error!', JSON.stringify(err), 'error');
            },
          })
          .render('#paypal-button-container');
      }
    } catch (error) {
      Swal.fire('Error initializing PayPal:', JSON.stringify(error), 'error');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
