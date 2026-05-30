import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
  IonLabel, IonButton, IonButtons, IonIcon, IonInput, IonSelect,
  IonSelectOption, IonDatetime, IonDatetimeButton, IonModal, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-treninzi',
  templateUrl: './treninzi.page.html',
  styleUrls: ['./treninzi.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
    IonLabel, IonButton, IonButtons, IonIcon, IonInput, IonSelect,
    IonSelectOption, IonDatetime, IonDatetimeButton, IonModal,
    CommonModule, FormsModule
  ]
})
export class TreninziPage implements OnInit {

  private authService = inject(AuthService);
  private alertCtrl = inject(AlertController);

  treninzi: any[] = [];
  treneri: any[] = [];
  prikaziFormu: boolean = false;
  minDatum: string = new Date().toISOString();

  noviTrening = {
    naziv: '',
    trenerUid: '',
    trenerIme: '',
    datum: new Date().toISOString(),
    kapacitet: 10,
    prijavljeni: 0
  };

  constructor() {
    addIcons({ addOutline, trashOutline });
  }

  ngOnInit() {
    // dohvatamo treninge iz servisa i sortiramo po datumu
    this.authService.getTreninzi().subscribe(data => {
      this.treninzi = data.sort((a: any, b: any) =>
        new Date(a.datum).getTime() - new Date(b.datum).getTime()
      );
    });

    // dohvatamo trenere iz servisa
    this.authService.getTreneri().subscribe(data => {
      this.treneri = data;
    });
  }

  otvoriFormu() {
    this.prikaziFormu = true;
  }

  zatvoriFormu() {
    this.prikaziFormu = false;
    this.noviTrening = {
      naziv: '',
      trenerUid: '',
      trenerIme: '',
      datum: new Date().toISOString(),
      kapacitet: 10,
      prijavljeni: 0
    };
  }

  async dodajTrening() {
    if (!this.noviTrening.naziv || !this.noviTrening.trenerUid) {
      const alert = await this.alertCtrl.create({
        header: 'Greška',
        message: 'Naziv i trener su obavezni!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const trener = this.treneri.find(t => t.uid === this.noviTrening.trenerUid);
    this.noviTrening.trenerIme = trener ? trener.name : '';

    try {
      await this.authService.dodajTrening({
        naziv: this.noviTrening.naziv,
        trenerUid: this.noviTrening.trenerUid,
        trenerIme: this.noviTrening.trenerIme,
        datum: this.noviTrening.datum,
        kapacitet: Number(this.noviTrening.kapacitet),
        prijavljeni: 0
      });

      const alert = await this.alertCtrl.create({
        header: 'Uspeh',
        message: 'Trening uspešno dodat!',
        buttons: [{ text: 'OK', handler: () => this.zatvoriFormu() }]
      });
      await alert.present();

    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Greška',
        message: 'Greška pri dodavanju treninga!',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async obrisiTrening(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Brisanje treninga',
      message: 'Da li ste sigurni da želite da obrišete ovaj trening?',
      buttons: [
        { text: 'Otkaži', role: 'cancel' },
        {
          text: 'Obriši',
          role: 'destructive',
          handler: async () => {
            await this.authService.obrisiTrening(id);
          }
        }
      ]
    });
    await alert.present();
  }
}