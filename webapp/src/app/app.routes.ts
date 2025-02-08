import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/manage/category/category.component';
import { CategoryFormComponent } from './components/manage/category-form/category-form.component';
import { BrandsComponent } from './components/manage/brands/brands.component';
import { BrandFormComponent } from './components/manage/brand-form/brand-form.component';
import { ProductsComponent } from './components/manage/products/products.component';
import { ProductFormComponent } from './components/manage/product-form/product-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { authGuard } from './guards/auth-guard';
import { afterLoginGuard } from './guards/after-login.guard';
import { isAdminGuard } from './guards/is-admin.guard';
import { AdminDashboardComponent } from './components/manage/admin-dashboard/admin-dashboard.component';
import { AdminloginComponent } from './components/adminlogin/adminlogin.component';
import { afteradminloginGuard } from './guards/afteradminlogin.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CustomerOrdersComponent } from './components/customer-orders/customer-orders.component';
import { OrdersComponent } from './components/manage/orders/orders.component';
import { UpdateOrderComponent } from './components/manage/update-order/update-order.component';
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'products/:id', component: ProductDetailsComponent },
      {
        path: 'profile/:username',
        component: ProfileComponent,
        canActivate: [authGuard],
      },
      {
        path: 'wishList',
        component: WishListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'cart',
        component: ShoppingCartComponent,
        canActivate: [authGuard],
      },
      {
        path: 'order',
        component: CustomerOrdersComponent,
        canActivate: [authGuard],
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [afterLoginGuard],
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [afterLoginGuard],
      },
      {
        path: 'admin/login',
        component: AdminloginComponent,
        canActivate: [afteradminloginGuard],
      },
    ],
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [isAdminGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'categories', component: CategoryComponent },
      { path: 'categories/add', component: CategoryFormComponent },
      { path: 'categories/:id', component: CategoryFormComponent },
      { path: 'brands', component: BrandsComponent },
      { path: 'brands/add', component: BrandFormComponent },
      { path: 'brands/:id', component: BrandFormComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/add', component: ProductFormComponent },
      { path: 'products/:id', component: ProductFormComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders/:id', component: UpdateOrderComponent },
    ],
  },
  { path: '**', component: NotFoundPageComponent },
];
