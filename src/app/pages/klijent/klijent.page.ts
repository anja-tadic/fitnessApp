import { Component, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barbellOutline, calendarOutline, qrCodeOutline, logOutOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-klijent',
  templateUrl: './klijent.page.html',
  styleUrls: ['./klijent.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet]
})
export class KlijentPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    addIcons({ barbellOutline, calendarOutline, qrCodeOutline, logOutOutline });
  }

  onLogOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}