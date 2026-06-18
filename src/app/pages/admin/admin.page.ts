
import { Component, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { peopleOutline, barbellOutline, calendarOutline, qrCodeOutline, logOutOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
 
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet]
})
export class AdminPage {
  private authService = inject(AuthService);
  private router = inject(Router);
 
  constructor() {
    addIcons({ peopleOutline, barbellOutline, calendarOutline, qrCodeOutline, logOutOutline });
  }
 
  onLogOut() {
    this.authService.logout(); // logout je sad sinhrona metoda, ne vraca Promise/Observable
    this.router.navigate(['/login']);
  }
}