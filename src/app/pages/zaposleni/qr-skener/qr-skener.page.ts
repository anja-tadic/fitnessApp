import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Html5Qrcode } from 'html5-qrcode';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-qr-skener',
  templateUrl: './qr-skener.page.html',
  styleUrls: ['./qr-skener.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, CommonModule]
})
export class QrSkenerPage implements OnInit, OnDestroy {

  html5QrCode: Html5Qrcode | null = null;
  skeniranje: boolean = false;
  poruka: string = '';
  greska: boolean = false;

  constructor(private firestore: Firestore, private auth: Auth, private router: Router) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {}

  async startSkeniranje() {
    this.poruka = '';
    this.html5QrCode = new Html5Qrcode('qr-reader');
    this.skeniranje = true;

    await this.html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (decodedText) => {
        await this.stopSkeniranje();
        await this.zabeleziPrisustvo(decodedText);
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

  async zabeleziPrisustvo(uid: string) {
    try {
      // Provjeri da li korisnik postoji
      const userRef = doc(this.firestore, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        this.poruka = 'QR kod nije validan!';
        this.greska = true;
        return;
      }

      const korisnik = userSnap.data();

      // Zabeleži prisustvo u Firestore
      await addDoc(collection(this.firestore, 'prisustvo'), {
        uid: uid,
        ime: korisnik['name'],
        datum: new Date().toISOString(),
        trener: this.auth.currentUser?.uid
      });

      this.poruka = `Prisustvo zabilježeno za: ${korisnik['name']}`;
      this.greska = false;

    } catch (error) {
      this.poruka = 'Greška pri bilježenju prisustva!';
      this.greska = true;
    }
  }

  goBack() {
    this.stopSkeniranje();
    this.router.navigate(['/zaposleni']);
  }

  ngOnDestroy() {
    this.stopSkeniranje();
  }
}
