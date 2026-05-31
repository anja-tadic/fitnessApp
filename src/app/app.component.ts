import { Component, inject, OnInit } from '@angular/core';
import {
  IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonIcon, IonMenuToggle,
  IonFab, IonFabButton, IonButton, IonButtons, MenuController
} from '@ionic/angular/standalone';
import { Router, RouterLink, NavigationStart } from '@angular/router';
import { AuthService } from './services/auth.service';
import { addIcons } from 'ionicons';
import { logOut, personCircle, barbell, calendar, qrCode, people, statsChart } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonItem, IonLabel, IonIcon, IonMenuToggle,
    IonFab, IonFabButton, IonButton, IonButtons, RouterLink
  ],
})
export class AppComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  public menu: MenuController = inject(MenuController);
  role: string = '';

  constructor() {
    addIcons({ logOut, personCircle, barbell, calendar, qrCode, people, statsChart });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.menu.close();
      }
    });
  }

  async ngOnInit() {
    this.authService.currentUser$.subscribe(async (user) => {
      if (user) {
        this.role = await this.authService.getUserRole(user.uid);
      } else {
        this.role = '';
      }
    });
  }

  async onLogOut() {
    await this.authService.logout();
    this.role = '';
    this.router.navigateByUrl('/login');
  }
}