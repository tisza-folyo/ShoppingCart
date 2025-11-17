import { Routes } from '@angular/router';
import { Product } from './components/product/product';
import { User } from './components/user/user';
import { Signup } from './components/user/signup/signup';
import { Home } from './components/home/home';
import { Login } from './components/user/login/login';
import { Cart } from './components/cart/cart';
import { Maintainer } from './components/maintainer/maintainer';
import { ManageProd } from './components/maintainer/manage-prod/manage-prod';
import { ManageCat } from './components/maintainer/manage-cat/manage-cat';
import { ManageOrd } from './components/maintainer/manage-ord/manage-ord';
import { ManageUser } from './components/maintainer/manage-user/manage-user';

export const routes: Routes = [
    {
        path: 'home',
        component: Home,
    },
    {
        path: 'product',
        component: Product
    },
    {
        path: 'user',
        component: User,
    },
    {
        path: 'signup',
        component: Signup
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'cart',
        component:Cart
    },
    {
        path: 'maintain',
        component: Maintainer
    },
    { 
        path: 'maintain/product',
        component: ManageProd
    },
    {
        path: 'maintain/category',
        component: ManageCat
    },
    {
        path: 'maintain/order',
        component: ManageOrd
    },
    {
        path: 'maintain/user',
        component: ManageUser
    }
];
