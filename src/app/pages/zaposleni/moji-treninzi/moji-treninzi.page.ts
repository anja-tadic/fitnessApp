import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonButtons } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-moji-treninzi',
  templateUrl: './moji-treninzi.page.html',
  styleUrls: ['./moji-treninzi.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonButtons, CommonModule]
})
export class MojiTreninziPage {

  private authService = inject(AuthService);
  private router = inject(Router);

  treninzi: any[] = [];

  ionViewWillEnter() {
    const uid = this.authService.getUserId();
    if (uid) {
      // uzimamo treninge za ovog trenera
      this.authService.getTreninziZaTrenera(uid).subscribe(data => {
        this.treninzi = data.sort((a: any, b: any) =>
          new Date(a.datum).getTime() - new Date(b.datum).getTime()
        );
      });
    }
  }

  otvoriDetalje(id: string) {
    this.router.navigate(['/zaposleni/trening-detalji', id]);
  }
}