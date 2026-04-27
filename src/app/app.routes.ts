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
        path: 'korisnik-detalji/:uid',
        loadComponent: () => import('./pages/admin/korisnik-detalji/korisnik-detalji.page').then(m => m.KorisnikDetaljiPage)
      },
      {
        path: 'treneri',
        loadComponent: () => import('./pages/admin/treneri/treneri.page').then(m => m.TreneriPage)
      },
      {
        path: 'trener-detalji/:uid',
        loadComponent: () => import('./pages/admin/trener-detalji/trener-detalji.page').then(m => m.TrenerDetaljiPage)
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
    loadComponent: () => import('./pages/zaposleni/zaposleni.page').then(m => m.ZaposleniPage),
    children: [
      {
        path: '',
        redirectTo: 'moji-treninzi',
        pathMatch: 'full'
      },
      {
        path: 'moji-treninzi',
        loadComponent: () => import('./pages/zaposleni/moji-treninzi/moji-treninzi.page').then(m => m.MojiTreninziPage)
      },
      {
        path: 'qr-skener',
        loadComponent: () => import('./pages/zaposleni/qr-skener/qr-skener.page').then(m => m.QrSkenerPage)
      },
      {
        path: 'statistika',
        loadComponent: () => import('./pages/zaposleni/statistika/statistika.page').then(m => m.StatistikaPage)
      },
      {
        path: 'trening-detalji/:id',
        loadComponent: () => import('./pages/zaposleni/trening-detalji/trening-detalji.page').then(m => m.TreningDetaljiPage)
      }
    ]
  },
  {
    path: 'klijent',
    loadComponent: () => import('./pages/klijent/klijent.page').then(m => m.KlijentPage)
  },  {
    path: 'treninzi',
    loadComponent: () => import('./pages/klijent/treninzi/treninzi.page').then( m => m.TreninziPage)
  },
  {
    path: 'moji-termini',
    loadComponent: () => import('./pages/klijent/moji-termini/moji-termini.page').then( m => m.MojiTerminiPage)
  },
  {
    path: 'qr-kod',
    loadComponent: () => import('./pages/klijent/qr-kod/qr-kod.page').then( m => m.QrKodPage)
  }

];