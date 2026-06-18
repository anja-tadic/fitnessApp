import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';//za skeniranje QR kodova
import { addIcons } from 'ionicons';
import { qrCodeOutline, checkmarkCircleOutline, closeCircleOutline, barbell, logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../../services/auth.service';
//@Component({...}) je dekorator koji govori Angular-u: Ova klasa nije obična TypeScript klasa, vec Angular komponenta
//bez toga qr page bi bila samo obicna klasa sa metodama, angular ne bi znao da je treba prikazati kao stranicu
@Component({//Dekorator koji povezuje TypeScript klasu sa HTML i SCSS fajlom
  selector: 'app-qr',//kako se komponenta zove u htmlu
  templateUrl: './qr.page.html',//koji html se koristi za prikaz
  styleUrls: ['./qr.page.scss'],//koji css fajl
  standalone: true,//komponenta sama navodi sta joj treba
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonCard, IonCardContent, CommonModule]//koje druge komponente ova komponenta koristi
})
export class QrPage implements OnInit {
//export – da bi ova klasa mogla da se koristi i u drugim fajlovima
  private authService = inject(AuthService);//Ubacujemo AuthService da bismo mogli da pozivamo njegove metode (getUserById, snimiPrisustvo, logout).
//AuthService - sadrzi svu logiku za komunikaciju sa Realtime Database
//inject(AuthService) – uzima instancu (kopiju) AuthService-a
//Promenljive koje pamte stanje: korisnik – podaci o skeniranom korisniku
//validan / nevalidan – da li je QR kod ispravan
//poruka – tekst poruke koja se prikazuje korisniku
  korisnik: any = null;//na početku, pre nego što admin skenira QR kod, nemamo nikakvog korisnika
  validan: boolean = false;
  nevalidan: boolean = false;
  poruka: string = '';

  constructor(private router: Router) {//Ubacujemo Router i registrujemo ikonice da mogu da se koriste u HTML-u.
    addIcons({ qrCodeOutline, checkmarkCircleOutline, closeCircleOutline, barbell, logOutOutline });
  }

  ngOnInit() {}//Prazna metoda – izvršava se kad se stranica učita, ali ovde ništa ne radimo pri pokretanju

  async startSkeniranje() {//Kada admin klikne dugme, prvo resetujemo sve promenljive na početne vrednosti (brišemo prethodni rezultat)
    this.korisnik = null;
    this.validan = false;
    this.nevalidan = false;
    this.poruka = '';

    try {
      //Pozivamo plugin koji otvara kameru. hint: QR_CODE kaže pluginu da traži samo QR kodove. 
      // scanInstructions je tekst koji se prikazuje na ekranu kamere. scanButton i scanText dodaju dugme "Otkaži". 
      // await znači da kod čeka da korisnik skenira ili otkaže pre nego što nastavi.
      //Ako je skeniranje uspelo, result.ScanResult sadrži pročitani tekst (uid korisnika) – prosleđujemo ga funkciji za proveru
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
        scanInstructions: 'Usmerite kameru ka QR kodu klijenta',
        scanButton: true,
        scanText: 'Otkaži'
      });

      if (result.ScanResult) {
        // proveriQR sad samo pokrece subscribe (HTTP poziv), ne vraca Promise, zato bez await
        this.proveriQR(result.ScanResult);
      }
    } catch (error) {
      // ako korisnik otkaze skeniranje ili dodje do greske, samo ignorisemo
    }
  }

  proveriQR(uid: string) {
    //Pitamo bazu (preko servisa) da li postoji korisnik sa tim uid-om.
    this.authService.getUserById(uid).subscribe({
      next: (korisnik) => {
        if (korisnik) {
          //Ako korisnik postoji, čuvamo njegove podatke i pozivamo funkciju 
          // koja pokušava da zabeleži prisustvo na trenutnom treningu. Ta funkcija vraća string sa rezultatom
          this.korisnik = korisnik;

          this.authService.snimiPrisustvo(uid).subscribe({
            next: (rezultat) => {
              if (rezultat === 'ok') {
                //Ako je sve u redu – prisustvo je zabeleženo, prikazujemo zelenu karticu sa podacima korisnika.
                this.validan = true;
                this.nevalidan = false;
              } else if (rezultat === 'nema_treninga') {
                //Ako trenutno nema treninga koji se odvija, prikazuje se poruka
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
                // i dalje prikazujemo zelenu karticu (validan kod), ali sa porukom da je već evidentiran.
                this.validan = true;
                this.nevalidan = false;
                this.poruka = 'Klijent je već evidentiran!';
              }
            },
            error: () => {
              //Ako nešto pukne (npr. greška u komunikaciji sa bazom), tretiramo kao nevalidan kod
              this.nevalidan = true;
            }
          });
        } else {
          //Ako korisnik sa tim uid-om uopšte ne postoji u bazi
          // kod nije validan, prikazuje se crvena kartica
          this.validan = false;
          this.nevalidan = true;
          this.poruka = 'QR kod nije validan!';
        }
      },
      error: () => {
        //Ako nešto pukne (npr. greška u komunikaciji sa bazom), tretiramo kao nevalidan kod
        this.nevalidan = true;
      }
    });
  }

  logout() {
    //Kada admin klikne Odjavi se – odjavljujemo ga preko servisa i šaljemo nazad na login stranicu.
    this.authService.logout();//logout je sad sinhrona metoda (ne vraca Promise/Observable), zato bez await
    this.router.navigate(['/login']);
  }
}