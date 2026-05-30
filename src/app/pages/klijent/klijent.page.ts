import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barbellOutline, calendarOutline, qrCodeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-klijent',
  templateUrl: './klijent.page.html',
  styleUrls: ['./klijent.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet]
})
export class KlijentPage {
  constructor() {
    addIcons({ barbellOutline, calendarOutline, qrCodeOutline });
  }
}
