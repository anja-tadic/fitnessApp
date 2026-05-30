import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
  IonLabel, IonButton, IonButtons, IonIcon, IonInput, IonSelect, 
  IonSelectOption, IonSearchbar, AlertController
} from '@ionic/angular/standalone';
import { AuthService } from '../../../services/auth.service';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-treneri',
  templateUrl: './treneri.page.html',
  styleUrls: ['./treneri.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
    IonLabel, IonButton, IonButtons, IonIcon, IonInput, IonSelect,
    IonSelectOption, IonSearchbar, CommonModule, FormsModule
  ]
})
export class TreneriPage implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  treneri: any[] = [];        // svi treneri iz baze
  filtrirani: any[] = [];     // treneri koji se prikazuju nakon pretrage
  prikaziFormu: boolean = false;

  noviTrener = {
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: ''
  };

  constructor() {
    addIcons({ addOutline, trashOutline });
  }

  ngOnInit() {
    this.authService.getTreneri().subscribe(data => {
      this.treneri = data;      // čuvamo sve
      this.filtrirani = data;   // na početku prikazujemo sve
    });
  }

  pretrazi(event: any) {
    const termin = event.detail.value?.toLowerCase() || '';
    this.filtrirani = this.treneri.filter(t =>
      t.name?.toLowerCase().includes(termin) ||
      t.email?.toLowerCase().includes(termin) ||
      t.phone?.toLowerCase().includes(termin)
    );
  }

  otvoriFormu() {
    this.prikaziFormu = true;
  }

  zatvoriFormu() {
    this.prikaziFormu = false;
    this.noviTrener = { name: '', email: '', password: '', phone: '', gender: '' };
  }

  async dodajTrenera() {
    if (!this.noviTrener.name || !this.noviTrener.email || !this.noviTrener.password) {
      const alert = await this.alertCtrl.create({
        header: 'Greška',
        message: 'Ime, email i lozinka su obavezni!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      await this.authService.register(
        this.noviTrener.email,
        this.noviTrener.password,
        'zaposleni',
        this.noviTrener.name,
        this.noviTrener.gender,
        this.noviTrener.phone
      );

      const alert = await this.alertCtrl.create({
        header: 'Uspeh',
        message: 'Trener uspešno dodat!',
        buttons: [{ text: 'OK', handler: () => this.zatvoriFormu() }]
      });
      await alert.present();

    } catch (error: any) {
      let poruka = 'Greška pri dodavanju trenera!';
      if (error.code === 'auth/email-already-in-use') poruka = 'Korisnik sa ovim emailom već postoji!';
      if (error.code === 'auth/weak-password') poruka = 'Lozinka mora imati najmanje 6 karaktera!';

      const alert = await this.alertCtrl.create({
        header: 'Greška',
        message: poruka,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async obrisiTrenera(uid: string) {
    const alert = await this.alertCtrl.create({
      header: 'Brisanje trenera',
      message: 'Da li ste sigurni da želite da obrišete ovog trenera?',
      buttons: [
        { text: 'Otkaži', role: 'cancel' },
        {
          text: 'Obriši',
          role: 'destructive',
          handler: async () => {
            await this.authService.deleteUser(uid); // brisanje kroz servis
          }
        }
      ]
    });
    await alert.present();
  }

  otvoriProfil(uid: string) {
    this.router.navigate(['/admin/trener-detalji', uid]);
  }
}