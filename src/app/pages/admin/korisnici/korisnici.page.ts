import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonBadge, IonButtons, IonButton, IonSearchbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular/standalone';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-korisnici',
  templateUrl: './korisnici.page.html',
  styleUrls: ['./korisnici.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonBadge, IonButtons, IonButton, IonSearchbar, CommonModule, FormsModule]
})
export class KorisniciPage implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  korisnici: any[] = [];        // svi korisnici iz baze
  filtrirani: any[] = [];       // korisnici koji se prikazuju nakon pretrage
  pretragaTermin: string = '';  // tekst koji korisnik ukuca

  ngOnInit() {
    this.authService.getKlijenti().subscribe(korisnici => {
      this.korisnici = korisnici;       // čuvamo sve
      this.filtrirani = korisnici;      // na početku prikazujemo sve
    });
  }

  pretrazi(event: any) {
    const termin = event.detail.value?.toLowerCase() || '';
    this.filtrirani = this.korisnici.filter(k =>
      k.name?.toLowerCase().includes(termin) ||
      k.email?.toLowerCase().includes(termin) ||
      k.role?.toLowerCase().includes(termin)
    );
  }

  otvoriProfil(uid: string) {
    this.router.navigate(['/admin/korisnik-detalji', uid]);
  }

  async obrisiKorisnika(uid: string) {
    const alert = await this.alertCtrl.create({
      header: 'Brisanje korisnika',
      message: 'Da li ste sigurni da želite da obrišete ovog korisnika?',
      buttons: [
        { text: 'Otkaži', role: 'cancel' },
        {
          text: 'Obriši',
          role: 'destructive',
          handler: async () => {
            await this.authService.deleteUser(uid);
            // lista se automatski osvežava jer koristimo subscribe
          }
        }
      ]
    });
    await alert.present();
  }
}
 
