import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
  IonLabel, IonButton, IonButtons, IonBackButton, AlertController, MenuController
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
  private auth = inject(Auth);
  private menu = inject(MenuController);

  treninzi: any[] = [];
  klijentUid: string = '';

  async ngOnInit() {
  await this.menu.close();
  
  document.addEventListener('click', (e) => {
    console.log('KLIK NA STRANICU', e.target);
  });

  this.auth.onAuthStateChanged(async user => {
    if (user) {
      this.klijentUid = user.uid;
      this.ucitajTreninge();
    }
  });
}

  async ucitajTreninge() {
    this.authService.getTreninzi().subscribe(async data => {
      const sad = new Date();
      //sad.setHours(0, 0, 0, 0); 

      const buduci = data.filter((t: any) => new Date(t.datum) > sad);
      const treninziSaStatusom = await Promise.all(buduci.map(async trening => {
        const prijavljen = await this.authService.jePrijavljen(this.klijentUid, trening.id);
         console.log('trening:', trening.naziv, 'kapacitet:', trening.kapacitet, typeof trening.kapacitet, 'prijavljeni:', trening.prijavljeni, typeof trening.prijavljeni);
        return { ...trening, prijavljen , kapacitet: Number(trening.kapacitet),    
        prijavljeni: Number(trening.prijavljeni)  
        };
      }));

      this.treninzi = treninziSaStatusom.sort((a: any, b: any) =>
        new Date(a.datum).getTime() - new Date(b.datum).getTime()
      );
    });
  }

  async prijaviSe(trening: any) {
    const treningVreme = new Date(trening.datum).getTime();
    const sadasnjost = new Date().getTime();
    const razlika = treningVreme - sadasnjost;
    const jedanDan = 24 * 60 * 60 * 1000;

    if (razlika < jedanDan) {
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
      this.ucitajTreninge();

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