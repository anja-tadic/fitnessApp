import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc, doc, getDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Html5Qrcode } from 'html5-qrcode';
import { addIcons } from 'ionicons';
import { arrowBackOutline, logOutOutline } from 'ionicons/icons';

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
    addIcons({ arrowBackOutline, logOutOutline });
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
      const userRef = doc(this.firestore, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        this.poruka = 'QR kod nije validan!';
        this.greska = true;
        return;
      }

      const korisnik = userSnap.data();

      const danas = new Date();
      const pocetak = new Date(danas.getFullYear(), danas.getMonth(), danas.getDate()).toISOString();
      const kraj = new Date(danas.getFullYear(), danas.getMonth(), danas.getDate() + 1).toISOString();

      const prisustvoRef = collection(this.firestore, 'prisustvo');
      const q = query(prisustvoRef,
        where('uid', '==', uid),
        where('datum', '>=', pocetak),
        where('datum', '<', kraj)
      );
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        this.poruka = `${korisnik['name']} je već skeniran danas!`;
        this.greska = true;
        return;
      }

      await addDoc(collection(this.firestore, 'prisustvo'), {
        uid: uid,
        ime: korisnik['name'],
        datum: new Date().toISOString(),
        trener: this.auth.currentUser?.uid
      });

      this.poruka = `Prisustvo zabeleženo za: ${korisnik['name']}`;
      this.greska = false;

    } catch (error) {
      this.poruka = 'Greška pri bilježenju prisustva!';
      this.greska = true;
    }
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }

  goBack() {
    this.stopSkeniranje();
    this.router.navigate(['/zaposleni']);
  }

  ngOnDestroy() {
    this.stopSkeniranje();
  }
}
