import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, 
  IonLabel, IonButton, IonButtons, IonBackButton, AlertController, MenuController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
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
export class TreninziPage {

  private authService = inject(AuthService);
  private alertCtrl = inject(AlertController);
  private router = inject(Router);
  private menu = inject(MenuController);

  treninzi: any[] = [];
  klijentUid: string = '';

  ionViewWillEnter() {
    this.menu.close();

    // AngularFire-ov onAuthStateChanged vise ne koristimo, uid uzimamo direktno iz servisa
    const uid = this.authService.getUserId();
    if (uid) {
      this.klijentUid = uid;
      this.ucitajTreninge();
    }
  }

  ucitajTreninge() {
    this.authService.getTreninzi().subscribe(data => {
      const sad = new Date();
      //sad.setHours(0, 0, 0, 0);

      const buduci = data.filter((t: any) => new Date(t.datum) > sad);

      if (buduci.length === 0) {
        this.treninzi = [];
        return;
      }

      // jePrijavljen je sad Observable, pa forkJoin radi posao koji je radio Promise.all
      const treninziObservables = buduci.map(trening =>
        this.authService.jePrijavljen(this.klijentUid, trening.id).pipe(
          map(prijavljen => {
            console.log('trening:', trening.naziv, 'kapacitet:', trening.kapacitet, typeof trening.kapacitet, 'prijavljeni:', trening.prijavljeni, typeof trening.prijavljeni);
            return { ...trening, prijavljen, kapacitet: Number(trening.kapacitet),
            prijavljeni: Number(trening.prijavljeni)
            };
          })
        )
      );

      forkJoin(treninziObservables).subscribe(treninziSaStatusom => {
        this.treninzi = treninziSaStatusom.sort((a: any, b: any) =>
          new Date(a.datum).getTime() - new Date(b.datum).getTime()
        );
      });
    });
  }

  async prijaviSe(trening: any) {
    const treningVreme = new Date(trening.datum).getTime();
    const sadasnjost = new Date().getTime();
    const razlika = treningVreme - sadasnjost;
    const jedanDan = 24 * 60 * 60 * 1000;

    if (razlika > jedanDan) {
      const alert = await this.alertCtrl.create({
        header: 'Prerano',
        message: 'Možete se prijaviti najranije 1 dan pre termina!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.authService.prijaviNaTrening(this.klijentUid, trening.id).subscribe({
      next: async () => {
        const alert = await this.alertCtrl.create({
          header: 'Uspeh',
          message: 'Uspešno ste se prijavili na trening!',
          buttons: ['OK']
        });
        await alert.present();
        this.ucitajTreninge();
      },
      error: async () => {
        const alert = await this.alertCtrl.create({
          header: 'Greška',
          message: 'Greška pri prijavi na trening!',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  otvoriDetalje(id: string) {
    this.router.navigate(['/klijent/trening-info', id]);
  }
}