import { Component, OnInit, inject } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';
import QRCode from 'qrcode';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-qr-kod',
  templateUrl: './qr-kod.page.html',
  styleUrls: ['./qr-kod.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, CommonModule, IonBackButton]
})
export class QrKodPage implements OnInit {

  private auth = inject(Auth);           // potreban za currentUser
  private authService = inject(AuthService);
  private router = inject(Router);

  qrCodeUrl: string = '';
  korisnikIme: string = '';

  constructor() {
    addIcons({ arrowBackOutline });
  }

  async ngOnInit() {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        // dohvatamo ime korisnika kroz servis
        const korisnik = await this.authService.getUserById(user.uid);
        if (korisnik) {
          this.korisnikIme = korisnik['name'];
        }

        // generisemo QR kod sa uid-om korisnika
        this.qrCodeUrl = await QRCode.toDataURL(user.uid, {
          width: 250,
          margin: 2,
          color: {
            dark: '#8B5CF6',
            light: '#0f0a1e'
          }
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

 
}
