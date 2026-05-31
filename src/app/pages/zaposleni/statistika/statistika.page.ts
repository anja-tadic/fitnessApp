import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, calendarOutline, timeOutline, qrCodeOutline, barbellOutline } from 'ionicons/icons';
import { AuthService } from '../../../services/auth.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-statistika',
  templateUrl: './statistika.page.html',
  styleUrls: ['./statistika.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonIcon, CommonModule]
})
export class StatistikaPage implements OnInit {

  private authService = inject(AuthService);
  private auth = inject(Auth);

  // Trenutni trening (±15 min)
  trenutniTrening: any = null;
  prijavljeniNaTrening: number = 0;
  prisutniNaTrening: number = 0;

  // Istorija svih dolazaka
  prisustva: any[] = [];

  constructor() {
    addIcons({ personOutline, calendarOutline, timeOutline, qrCodeOutline, barbellOutline });
  }

  async ngOnInit() {
    await this.ucitajStatistiku();
  }

  async ucitajStatistiku() {
    const trenerUid = this.auth.currentUser?.uid;
    if (!trenerUid) return;

    // 1. Pronađi trenutni trening (±15 min)
    const sad = new Date();
    const minus15 = new Date(sad.getTime() - 15 * 60 * 1000);
    const plus15 = new Date(sad.getTime() + 15 * 60 * 1000);

    this.authService.getTreninziZaTrenera(trenerUid).subscribe(async treninzi => {
      // pronađi trening koji je u opsegu ±15 min
      const aktivni = treninzi.find((t: any) => {
        const datum = new Date(t.datum);
        return datum >= minus15 && datum <= plus15;
      });

      if (aktivni) {
        this.trenutniTrening = aktivni;

        // broj prijavljenih na taj trening
        this.prijavljeniNaTrening = Number(aktivni.prijavljeni) || 0;

        // broj koji je skenirao QR (prisustvo) za taj trening
        const svaPrivisustva = await this.authService.getPrisustva();
        this.prisutniNaTrening = svaPrivisustva.filter(
          (p: any) => p.treningId === aktivni.id
        ).length;

      } else {
        this.trenutniTrening = null;
        this.prijavljeniNaTrening = 0;
        this.prisutniNaTrening = 0;
      }

      // istorija svih dolazaka za ovog trenera
      const svaPrivisustva = await this.authService.getPrisustva();
      const treningIds = treninzi.map((t: any) => t.id);
      this.prisustva = svaPrivisustva
        .filter((p: any) => treningIds.includes(p.treningId))
        .map((p: any) => ({
          ...p,
          datumFormatiran: new Date(p.datum).toLocaleDateString('sr-RS', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
    });
  }
}