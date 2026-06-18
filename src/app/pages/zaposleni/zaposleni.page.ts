import { Component, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, qrCodeOutline, barChartOutline, logOutOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-zaposleni',
  templateUrl: './zaposleni.page.html',
  styleUrls: ['./zaposleni.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet]
})
export class ZaposleniPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    addIcons({ calendarOutline, qrCodeOutline, barChartOutline, logOutOutline });
  }

  onLogOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}