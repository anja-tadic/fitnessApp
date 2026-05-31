import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, calendarOutline, timeOutline, qrCodeOutline } from 'ionicons/icons';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-statistika',
  templateUrl: './statistika.page.html',
  styleUrls: ['./statistika.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonIcon, CommonModule]
})
export class StatistikaPage implements OnInit {

  private authService = inject(AuthService);

  prisustva: any[] = [];
  ukupno: number = 0;
  danas: number = 0;
  prijavljeni: number = 0;

  constructor() {
    addIcons({ personOutline, calendarOutline, timeOutline, qrCodeOutline });
  }

  async ngOnInit() {
    await this.ucitajStatistiku();
  }

  async ucitajStatistiku() {
    const sva = await this.authService.getPrisustva();
    const svePrijave = await this.authService.getPrijave();

    this.prisustva = sva.map(p => ({
      ...p,
      datumFormatiran: new Date(p['datum']).toLocaleDateString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    this.ukupno = this.prisustva.length;
    this.prijavljeni = svePrijave.length;

    const danas = new Date();
    const pocetak = new Date(danas.getFullYear(), danas.getMonth(), danas.getDate()).toISOString();
    const kraj = new Date(danas.getFullYear(), danas.getMonth(), danas.getDate() + 1).toISOString();
    this.danas = this.prisustva.filter(p => p.datum >= pocetak && p.datum < kraj).length;
  }
}