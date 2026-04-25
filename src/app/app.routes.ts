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
    loadComponent: () => import('./pages/admin/admin.page').then(m => m.AdminPage),
    children: [
      {
        path: '',
        redirectTo: 'korisnici',
        pathMatch: 'full'
      },
      {
        path: 'korisnici',
        loadComponent: () => import('./pages/admin/korisnici/korisnici.page').then(m => m.KorisniciPage)
      },
      {
        path: 'korisnik-detalji/:uid',//prosledjujemo i uid korisnika kroz rutu
        loadComponent: () => import('./pages/admin/korisnik-detalji/korisnik-detalji.page').then(m => m.KorisnikDetaljiPage)
      },
      {
        path: 'treneri',
        loadComponent: () => import('./pages/admin/treneri/treneri.page').then(m => m.TreneriPage)
      },
      {
        path: 'treninzi',
        loadComponent: () => import('./pages/admin/treninzi/treninzi.page').then(m => m.TreninziPage)
      },
      {
        path: 'qr',
        loadComponent: () => import('./pages/admin/qr/qr.page').then(m => m.QrPage)
      }
    ]
  },
  {
    path: 'zaposleni',
    loadComponent: () => import('./pages/zaposleni/zaposleni.page').then(m => m.ZaposleniPage)
  },
  {
    path: 'klijent',
    loadComponent: () => import('./pages/klijent/klijent.page').then(m => m.KlijentPage)
  },
  {
    path: 'korisnik-detalji',
    loadComponent: () => import('./pages/admin/korisnik-detalji/korisnik-detalji.page').then( m => m.KorisnikDetaljiPage)
  },

];