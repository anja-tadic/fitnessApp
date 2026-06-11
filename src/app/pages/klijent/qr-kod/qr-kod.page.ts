import { Component, OnInit, inject } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';//za navigaciju izmedju stranica
import { Auth } from '@angular/fire/auth';//Firebase Authentication servis – pristup informacijama o trenutno prijavljenom korisniku
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
//3 servisa koja koristimo
//Auth = ko je prijavljen
//AuthService = šta znamo o tom korisniku + sve ostale operacije sa našom bazom (treninzi, prisustvo...)
  private auth = inject(Auth);//direktan pristup Firebase Authentication-u (da saznamo ko je trenutno prijavljen), Auth je Firebase servis koji dolazi iz biblioteke @angular/fire/auth
  private authService = inject(AuthService);//naš servis (da dohvatimo ime tog korisnika iz baze)
  private router = inject(Router);//za navigaciju

  qrCodeUrl: string = '';//ovde će se sačuvati generisana QR slika
  korisnikIme: string = '';// ime korisnika koje prikazujemo iznad QR koda
  //Obe počinju kao prazan string '', jer na početku ništa nije učitano

  constructor() {
    //Registrujemo ikonice da mogu da se koriste u HTML-u
    addIcons({ arrowBackOutline, barbell });
  }

  async ngOnInit() {//unutar ovoga se izvrsava logika
    //onAuthStateChanged – funkcija koja osluskuje, kažemo joj: 
    // pozovi ovu fju svaki put kada se promeni status prijave (korisnik se prijavi, odjavi, ili stranica se osveži)
    //user – ili sadrži podatke o prijavljenom korisniku, ili je null (ako niko nije prijavljen)
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        //user.uid – jedinstveni ID prijavljenog korisnika (iz Firebase Authentication)
        const korisnik = await this.authService.getUserById(user.uid);
        if (korisnik) {
          this.korisnikIme = korisnik['name'];
        }

        // QRCode.toDataURL - generiše QR kod sliku čiji je sadržaj user.uid
        this.qrCodeUrl = await QRCode.toDataURL(user.uid, {
          width: 250,
          margin: 2,
          color: {
            dark: '#FF6B35',   
            light: '#1a1a1a'
          }
        });
      } else {
        this.router.navigate(['/login']);
        //Ako user ne postoji (niko nije prijavljen) – preusmeravamo na login stranicu. 
        // Ovo sprečava da neko ko nije prijavljen direktno otvori /qr-kod URL i vidi praznu stranicu.
      }
    });
  }

 
}
