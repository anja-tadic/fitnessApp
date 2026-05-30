import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonBackButton, IonButtons, IonIcon, AlertController } from '@ionic/angular/standalone';
import { Auth } from '@angular/fire/auth';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-moji-termini',
  templateUrl: './moji-termini.page.html',
  styleUrls: ['./moji-termini.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonBackButton, IonButtons, IonIcon, CommonModule]
})
export class MojiTerminiPage implements OnInit {

  private authService = inject(AuthService);
  private auth = inject(Auth); // potreban samo za currentUser
  private alertCtrl = inject(AlertController);

  termini: any[] = [];

  constructor() {
    addIcons({ closeCircleOutline });
  }

  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.ucitajTermine(user.uid);
      }
    });
  }

  async ucitajTermine(klijentUid: string) {
    this.termini = await this.authService.getTerminiKlijenta(klijentUid); 
  }

  // Proveravamo da li klijent moze da otkaze — mora biti najmanje 1h pre treninga
  mozeDaOtkaze(datum: string): boolean {
    const treningVreme = new Date(datum).getTime();
    const sadasnjost = new Date().getTime();
    const razlika = treningVreme - sadasnjost;
    const jedanSat = 60 * 60 * 1000; // 1 sat u milisekundama
    return razlika > jedanSat;
  }

  async otkazi(termin: any) {
    if (!this.mozeDaOtkaze(termin.datum)) {
      const alert = await this.alertCtrl.create({
        header: 'Greška',
        message: 'Ne možete otkazati trening manje od 1 sat pre početka!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Otkazivanje termina',
      message: 'Da li ste sigurni da želite da otkažete ovaj termin?',
      buttons: [
        { text: 'Nazad', role: 'cancel' },
        {
          text: 'Otkaži termin',
          role: 'destructive',
          handler: async () => {
            try {
              await this.authService.otkaziTermin(termin.prijavaId, termin.treningId); 

              const successAlert = await this.alertCtrl.create({
                header: 'Uspeh',
                message: 'Termin je uspešno otkazan!',
                buttons: [{ text: 'OK', handler: () => this.ucitajTermine(this.auth.currentUser!.uid) }]
              });
              await successAlert.present();

            } catch (error) {
              const errAlert = await this.alertCtrl.create({
                header: 'Greška',
                message: 'Greška pri otkazivanju!',
                buttons: ['OK']
              });
              await errAlert.present();
            }
          }
        }
      ]
    });
    await alert.present();
  }
}