import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { peopleOutline, barbellOutline, calendarOutline, qrCodeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class AdminPage {
  constructor() {
    addIcons({ peopleOutline, barbellOutline, calendarOutline, qrCodeOutline });
  }
}