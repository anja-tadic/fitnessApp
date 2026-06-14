import { Component, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, qrCodeOutline, barChartOutline, logOutOutline } from 'ionicons/icons';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-zaposleni',
  templateUrl: './zaposleni.page.html',
  styleUrls: ['./zaposleni.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet]
})
export class ZaposleniPage {
  private auth = inject(Auth);
  private router = inject(Router);

  constructor() {
    addIcons({ calendarOutline, qrCodeOutline, barChartOutline, logOutOutline });
  }

  async onLogOut() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}