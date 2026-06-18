import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
  IonLabel, IonButton, IonButtons, IonIcon, IonInput, IonSelect, 
  IonSelectOption, IonDatetime, IonDatetimeButton, IonModal, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, createOutline } from 'ionicons/icons';
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
export class TreninziPage {

  private authService = inject(AuthService);
  private alertCtrl = inject(AlertController);

  treninzi: any[] = [];
  treneri: any[] = [];
  prikaziFormu: boolean = false;
  editMode: boolean = false;
  editTreningId: string = '';
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
    addIcons({ addOutline, trashOutline, createOutline });
  }

  ionViewWillEnter() {
    this.authService.getTreninzi().subscribe(data => {
      this.treninzi = data.sort((a: any, b: any) =>
        new Date(a.datum).getTime() - new Date(b.datum).getTime()
      );
    });

    this.authService.getTreneri().subscribe(data => {
      this.treneri = data;
    });
  }

  otvoriFormu() {
    this.editMode = false;
    this.prikaziFormu = true;
  }

  otvoriEdit(trening: any) {
    this.editMode = true;
    this.editTreningId = trening.id;
    this.noviTrening = {
      naziv: trening.naziv,
      trenerUid: trening.trenerUid,
      trenerIme: trening.trenerIme,
      datum: trening.datum,
      kapacitet: trening.kapacitet,
      prijavljeni: trening.prijavljeni
    };
    this.prikaziFormu = true;
  }

  zatvoriFormu() {
    this.prikaziFormu = false;
    this.editMode = false;
    this.editTreningId = '';
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

    if (this.editMode) {
      // IZMENA postojećeg treninga
      this.authService.updateTrening(this.editTreningId, {
        naziv: this.noviTrening.naziv,
        trenerUid: this.noviTrening.trenerUid,
        trenerIme: this.noviTrening.trenerIme,
        datum: this.noviTrening.datum,
        kapacitet: Number(this.noviTrening.kapacitet)
      }).subscribe({
        next: async () => {
          // GET više nije realtime listener, pa ručno ažuriramo lokalnu listu
          const idx = this.treninzi.findIndex(t => t.id === this.editTreningId);
          if (idx !== -1) {
            this.treninzi[idx] = {
              ...this.treninzi[idx],
              naziv: this.noviTrening.naziv,
              trenerUid: this.noviTrening.trenerUid,
              trenerIme: this.noviTrening.trenerIme,
              datum: this.noviTrening.datum,
              kapacitet: Number(this.noviTrening.kapacitet)
            };
            this.treninzi.sort((a: any, b: any) =>
              new Date(a.datum).getTime() - new Date(b.datum).getTime()
            );
          }

          const alert = await this.alertCtrl.create({
            header: 'Uspeh',
            message: 'Trening uspešno izmenjen!',
            backdropDismiss: false,
            buttons: [{ text: 'OK', handler: async () => { await alert.dismiss(); this.zatvoriFormu(); } }]
          });
          await alert.present();
        },
        error: async () => {
          const alert = await this.alertCtrl.create({
            header: 'Greška',
            message: 'Greška pri čuvanju treninga!',
            buttons: ['OK']
          });
          await alert.present();
        }
      });

    } else {
      // DODAVANJE novog treninga
      this.authService.dodajTrening({
        naziv: this.noviTrening.naziv,
        trenerUid: this.noviTrening.trenerUid,
        trenerIme: this.noviTrening.trenerIme,
        datum: this.noviTrening.datum,
        kapacitet: Number(this.noviTrening.kapacitet),
        prijavljeni: 0
      }).subscribe({
        next: async (response) => {
          // POST vraca { name: 'generisaniKljuc' }, kao push() ranije
          this.treninzi.push({
            id: response.name,
            naziv: this.noviTrening.naziv,
            trenerUid: this.noviTrening.trenerUid,
            trenerIme: this.noviTrening.trenerIme,
            datum: this.noviTrening.datum,
            kapacitet: Number(this.noviTrening.kapacitet),
            prijavljeni: 0
          });
          this.treninzi.sort((a: any, b: any) =>
            new Date(a.datum).getTime() - new Date(b.datum).getTime()
          );

          const alert = await this.alertCtrl.create({
            header: 'Uspeh',
            message: 'Trening uspešno dodat!',
            backdropDismiss: false,
            buttons: [{ text: 'OK', handler: async () => { await alert.dismiss(); this.zatvoriFormu(); } }]
          });
          await alert.present();
        },
        error: async () => {
          const alert = await this.alertCtrl.create({
            header: 'Greška',
            message: 'Greška pri čuvanju treninga!',
            buttons: ['OK']
          });
          await alert.present();
        }
      });
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
          handler: () => {
            this.authService.obrisiTrening(id).subscribe(() => {
              // GET više nije realtime listener, pa ručno ažuriramo lokalnu listu
              this.treninzi = this.treninzi.filter(t => t.id !== id);
            });
          }
        }
      ]
    });
    await alert.present();
  }
}