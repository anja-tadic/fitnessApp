import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonBackButton, IonButtons, IonItemDivider } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-trening-detalji',
  templateUrl: './trening-detalji.page.html',
  styleUrls: ['./trening-detalji.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonBackButton, IonButtons, IonItemDivider, CommonModule]
})
export class TreningDetaljiPage {

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  trening: any = null;
  klijenti: any[] = [];

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id'); // uzimamo id iz URL-a

    if (id) {
      this.authService.getTreningById(id).subscribe(trening => { // koristimo postojecu metodu
        this.trening = trening;

        if (this.trening) {
          this.authService.getKlijentiZaTrening(id).subscribe(klijenti => { // dohvatamo prijavljene
            this.klijenti = klijenti;
          });
        }
      });
    }
  }
}