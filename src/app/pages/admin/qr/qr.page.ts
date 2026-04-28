import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Html5Qrcode } from 'html5-qrcode';
import { addIcons } from 'ionicons';
import { qrCodeOutline, checkmarkCircleOutline, closeCircleOutline, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonCard, IonCardContent, CommonModule]
})
export class QrPage implements OnInit, OnDestroy {

  html5QrCode: Html5Qrcode | null = null;
  skeniranje: boolean = false;
  korisnik: any = null;
  validan: boolean = false;
  nevalidan: boolean = false;

  constructor(private firestore: Firestore, private auth: Auth, private router: Router) {
    addIcons({ qrCodeOutline, checkmarkCircleOutline, closeCircleOutline, logOutOutline });
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
        await this.provjeriQR(decodedText);
      },
      (error) => {}
    );
  }

  async stopSkeniranje() {
    if (this.html5QrCode && this.skeniranje) {
      await this.html5QrCode.stop();
      this.skeniranje = false;
    }
  }

  async provjeriQR(uid: string) {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        this.korisnik = userSnap.data();
        this.validan = true;
        this.nevalidan = false;
      } else {
        this.korisnik = null;
        this.validan = false;
        this.nevalidan = true;
      }
    } catch (error) {
      this.nevalidan = true;
    }
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.stopSkeniranje();
  }
}
