import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, 
  IonBackButton, IonButtons, IonButton, IonInput, AlertController 
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-korisnik-detalji',
  templateUrl: './korisnik-detalji.page.html',
  styleUrls: ['./korisnik-detalji.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel,
    IonBackButton, IonButtons, IonButton, IonInput, CommonModule, FormsModule
  ]
})
export class KorisnikDetaljiPage implements OnInit {

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  korisnik: any = null;
  editMode: boolean = false;

  async ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('uid');
    if (uid) {
      this.korisnik = await this.authService.getUserById(uid);
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  async sacuvajIzmene() {
    if (!this.korisnik.email || !this.korisnik.phone) {
      const alert = await this.alertCtrl.create({
        header: 'Greška',
        message: 'Email i telefon su obavezni!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      await this.authService.updateUser(this.korisnik.uid, {
        email: this.korisnik.email,
        phone: this.korisnik.phone
      });

      const alert = await this.alertCtrl.create({
        header: 'Uspeh',
        message: 'Podaci uspešno sačuvani!',
        buttons: [{ text: 'OK', handler: () => this.editMode = false }]
      });
      await alert.present();

    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Greška',
        message: 'Greška pri čuvanju podataka!',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}