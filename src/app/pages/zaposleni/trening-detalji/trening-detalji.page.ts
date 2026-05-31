import { Component, OnInit, inject } from '@angular/core';
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
export class TreningDetaljiPage implements OnInit {

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  trening: any = null;
  klijenti: any[] = [];

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); // uzimamo id iz URL-a

    if (id) {
      this.trening = await this.authService.getTreningById(id); // koristimo postojecu metodu

      if (this.trening) {
        this.klijenti = await this.authService.getKlijentiZaTrening(id); // dohvatamo prijavljene
      }
    }
  }
}