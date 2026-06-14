import { Component, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barbellOutline, calendarOutline, qrCodeOutline, logOutOutline } from 'ionicons/icons';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-klijent',
  templateUrl: './klijent.page.html',
  styleUrls: ['./klijent.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet]
})
export class KlijentPage {
  private auth = inject(Auth);
  private router = inject(Router);

  constructor() {
    addIcons({ barbellOutline, calendarOutline, qrCodeOutline, logOutOutline });
  }

  async onLogOut() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}