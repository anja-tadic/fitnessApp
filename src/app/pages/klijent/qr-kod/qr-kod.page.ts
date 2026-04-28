import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import QRCode from 'qrcode';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-qr-kod',
  templateUrl: './qr-kod.page.html',
  styleUrls: ['./qr-kod.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, CommonModule]
})
export class QrKodPage implements OnInit {

  qrCodeUrl: string = '';
  korisnikIme: string = '';

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    addIcons({ arrowBackOutline });
  }

  async ngOnInit() {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(this.firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.korisnikIme = docSnap.data()['name'];
        }

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

  goBack() {
    this.router.navigate(['/klijent']);
  }
}
