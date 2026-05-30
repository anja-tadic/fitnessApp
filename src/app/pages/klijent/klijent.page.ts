import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { fitnessOutline, calendarOutline, qrCodeOutline, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-klijent',
  templateUrl: './klijent.page.html',
  styleUrls: ['./klijent.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonCard, IonCardContent, CommonModule]
})
export class KlijentPage {

  constructor(private authService: AuthService, private router: Router) {
    addIcons({ fitnessOutline, calendarOutline, qrCodeOutline, logOutOutline });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToTreninzi() {
    this.router.navigate(['/treninzi']);
  }

  goToMojiTermini() {
    this.router.navigate(['/moji-termini']);
  }

  goToQR() {
    this.router.navigate(['/qr-kod']);
  }
}
