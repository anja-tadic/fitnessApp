import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, qrCodeOutline, barChartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-zaposleni',
  templateUrl: './zaposleni.page.html',
  styleUrls: ['./zaposleni.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet]
})
export class ZaposleniPage {
  constructor() {
    addIcons({ calendarOutline, qrCodeOutline, barChartOutline });
  }
}