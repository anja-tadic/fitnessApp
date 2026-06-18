import { Component, OnInit, inject } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';//za navigaciju izmedju stranica
import { AuthService } from '../../../services/auth.service';//servis za rad sa Realtime Database
import QRCode from 'qrcode';//Biblioteka koja generiše QR kod kao sliku
import { addIcons } from 'ionicons';
import { arrowBackOutline, barbell } from 'ionicons/icons';
//Ikonice koje koristimo (strelica nazad, bučica)

@Component({
  selector: 'app-qr-kod',
  templateUrl: './qr-kod.page.html',
  styleUrls: ['./qr-kod.page.scss'],
  standalone: true,
  //Ionic UI komponente koje se koriste u HTML-u. IonBackButton - dugme za povratak na prethodnu stranicu.
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, CommonModule, IonBackButton]
})
export class QrKodPage implements OnInit {
//AuthService = ko je prijavljen (getUserId) + šta znamo o tom korisniku + sve ostale operacije sa našom bazom (treninzi, prisustvo...)
  private authService = inject(AuthService);//naš servis – i ko je prijavljen, i ime tog korisnika iz baze
  private router = inject(Router);//za navigaciju

  qrCodeUrl: string = '';//ovde će se sačuvati generisana QR slika
  korisnikIme: string = '';// ime korisnika koje prikazujemo iznad QR koda
  //Obe počinju kao prazan string '', jer na početku ništa nije učitano

  constructor() {
    //Registrujemo ikonice da mogu da se koriste u HTML-u
    addIcons({ arrowBackOutline, barbell });
  }

  ngOnInit() {//unutar ovoga se izvrsava logika
    // AngularFire-ov onAuthStateChanged vise ne koristimo, uid uzimamo direktno iz servisa
    // (cuva se u memoriji nakon login-a preko AuthService)
    const uid = this.authService.getUserId();

    if (uid) {
      //uid – jedinstveni ID prijavljenog korisnika
      this.authService.getUserById(uid).subscribe(async korisnik => {
        if (korisnik) {
          this.korisnikIme = korisnik['name'];
        }

        // QRCode.toDataURL - generiše QR kod sliku čiji je sadržaj uid
        this.qrCodeUrl = await QRCode.toDataURL(uid, {
          width: 250,
          margin: 2,
          color: {
            dark: '#FF6B35',   
            light: '#1a1a1a'
          }
        });
      });
    } else {
      this.router.navigate(['/login']);
      //Ako uid ne postoji (niko nije prijavljen) – preusmeravamo na login stranicu. 
      // Ovo sprečava da neko ko nije prijavljen direktno otvori /qr-kod URL i vidi praznu stranicu.
    }
  }

 
}