import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { Html5Qrcode } from 'html5-qrcode';
import { addIcons } from 'ionicons';
import { qrCodeOutline, checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonCard, IonCardContent, CommonModule]
})
export class QrPage implements OnInit, OnDestroy {

  private authService = inject(AuthService);

  html5QrCode: Html5Qrcode | null = null;
  skeniranje: boolean = false;
  korisnik: any = null;
  validan: boolean = false;
  nevalidan: boolean = false;
  poruka: string = '';

  constructor() {
    addIcons({ qrCodeOutline, checkmarkCircleOutline, closeCircleOutline });
  }

  ngOnInit() {}

  async startSkeniranje() {
    this.korisnik = null;
    this.validan = false;
    this.nevalidan = false;
    this.html5QrCode = new Html5Qrcode('qr-reader-admin');
    this.skeniranje = true;

    await this.html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (decodedText) => {
        await this.stopSkeniranje();
        await this.proveriQR(decodedText);
      },
      (error) => {} // ignorisemo greske skeniranja
    );
  }

  async stopSkeniranje() {
    if (this.html5QrCode && this.skeniranje) {
      await this.html5QrCode.stop();
      this.skeniranje = false;
    }
  }

async proveriQR(uid: string) {
  try {
    const korisnik = await this.authService.getUserById(uid);
    if (korisnik) {
      this.korisnik = korisnik;

      const rezultat = await this.authService.snimiPrisustvo(uid);

      if (rezultat === 'ok') {
        this.validan = true;
        this.nevalidan = false;
      } else if (rezultat === 'nema_treninga') {
        this.korisnik = null;
        this.validan = false;
        this.nevalidan = true;
        this.poruka = 'Nema aktivnog treninga u ovom trenutku!';
      } else if (rezultat === 'nije_prijavljen') {
        this.korisnik = null;
        this.validan = false;
        this.nevalidan = true;
        this.poruka = 'Klijent nije prijavljen na trenutni trening!';
      } else if (rezultat === 'vec_evidentiran') {
        this.validan = true;
        this.nevalidan = false;
        this.poruka = 'Klijent je već evidentiran!';
      }
    } else {
      this.validan = false;
      this.nevalidan = true;
      this.poruka = 'QR kod nije validan!';
    }
  } catch (error) {
    this.nevalidan = true;
  }
}

  ngOnDestroy() {
    this.stopSkeniranje();
  }
}
