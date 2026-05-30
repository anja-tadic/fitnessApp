import { Component, inject, OnInit } from '@angular/core';
import {
  IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonIcon, IonMenuToggle
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { addIcons } from 'ionicons';
import { logOut, personCircle, barbell, calendar, qrCode, people, statsChart } from 'ionicons/icons';

@Component({ //html tag za ovu komponentu
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonItem, IonLabel, IonIcon, IonMenuToggle, RouterLink
  ],
})
export class AppComponent implements OnInit { // interfejs OnInit, kaze da mora da imamo i ngOnInit
  authService: AuthService = inject(AuthService); // trazi da ima authService
  router: Router = inject(Router); // rute
  role: string = ''; // ulogu

  constructor() {
    addIcons({ logOut, personCircle, barbell, calendar, qrCode, people, statsChart });
  }

  async ngOnInit() {
    this.authService.currentUser$.subscribe(async (user) => { // subscribe slusa observale od currentuser
      if (user) {
        this.role = await this.authService.getUserRole(user.uid);
      } else {
        this.role = '';
      }
    });
  }

  async onLogOut() { // sta raditi za logout
    await this.authService.logout();  
    this.role = ''; 
    this.router.navigateByUrl('/login');
  }
}