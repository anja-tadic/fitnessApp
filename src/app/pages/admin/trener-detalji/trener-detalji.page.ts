import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, 
  IonBackButton, IonButtons, IonButton, IonInput, AlertController 
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-trener-detalji',
  templateUrl: './trener-detalji.page.html',
  styleUrls: ['./trener-detalji.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel,
    IonBackButton, IonButtons, IonButton, IonInput, CommonModule, FormsModule
  ]
})
export class TrenerDetaljiPage implements OnInit {

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private alertCtrl = inject(AlertController);

  trener: any = null;
  editMode: boolean = false; // da li je forma za izmenu otvorena

  async ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('uid');
    if (uid) {
      this.trener = await this.authService.getUserById(uid); // Otvaramo detalje tog jednog trenera
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode; // otvori/zatvori formu
  }

  async sacuvajIzmene() {
    if (!this.trener.email || !this.trener.phone) {
      const alert = await this.alertCtrl.create({
        header: 'Greška',
        message: 'Email i telefon su obavezni!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      await this.authService.updateUser(this.trener.uid, { // editovanje korisnika
        email: this.trener.email,
        phone: this.trener.phone
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