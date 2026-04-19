import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.page').then(m => m.AdminPage)
  },
  {
    path: 'zaposleni',
    loadComponent: () => import('./pages/zaposleni/zaposleni.page').then(m => m.ZaposleniPage)
  },
  {
    path: 'klijent',
    loadComponent: () => import('./pages/klijent/klijent.page').then(m => m.KlijentPage)
  },
];
