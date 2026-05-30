import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
  IonLabel, IonButton, IonButtons, IonBackButton, AlertController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-treninzi',
  templateUrl: './treninzi.page.html',
  styleUrls: ['./treninzi.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
    IonLabel, IonButton, IonButtons, IonBackButton, CommonModule
  ]
})
export class TreninziPage implements OnInit {

  private authService = inject(AuthService);
  private alertCtrl = inject(AlertController);
  private router = inject(Router);
  private auth = inject(Auth); // potreban za currentUser

  treninzi: any[] = [];
  klijentUid: string = '';

  ngOnInit() {
    // cekamo da se korisnik ucita
    this.auth.onAuthStateChanged(async user => {
      if (user) {
        this.klijentUid = user.uid;
        this.ucitajTreninge();
      }
    });
  }

  async ucitajTreninge() {
    // dohvatamo sve treninge
    this.authService.getTreninzi().subscribe(async data => {
      // za svaki trening proveravamo da li je klijent vec prijavljen
      const treninziSaStatusom = await Promise.all(data.map(async trening => {
        const prijavljen = await this.authService.jePrijavljen(this.klijentUid, trening.id);
        return { ...trening, prijavljen };
      }));

      // sortiramo po datumu
      this.treninzi = treninziSaStatusom.sort((a: any, b: any) =>
        new Date(a.datum).getTime() - new Date(b.datum).getTime()
      );
    });
  }

  async prijaviSe(trening: any) {
    // provera — prijava najranije 1 dan pre termina
    const treningVreme = new Date(trening.datum).getTime();
    const sadasnjost = new Date().getTime();
    const razlika = treningVreme - sadasnjost;
    const jedanDan = 24 * 60 * 60 * 1000; // 1 dan u milisekundama

    if (razlika > jedanDan) {
      const alert = await this.alertCtrl.create({
        header: 'Prerano',
        message: 'Možete se prijaviti najranije 1 dan pre termina!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      await this.authService.prijaviNaTrening(this.klijentUid, trening.id);
      const alert = await this.alertCtrl.create({
        header: 'Uspeh',
        message: 'Uspešno ste se prijavili na trening!',
        buttons: ['OK']
      });
      await alert.present();
      this.ucitajTreninge(); // osvezavamo listu

    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Greška',
        message: 'Greška pri prijavi na trening!',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  otvoriDetalje(id: string) {
    this.router.navigate(['/klijent/trening-info', id]);
  }
}