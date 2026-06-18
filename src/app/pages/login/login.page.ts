import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonItem, IonLabel, IonInput,
  IonButton, IonIcon, IonInputPasswordToggle,
  LoadingController, AlertController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { barbell, mailOutline, lockClosedOutline, arrowForward } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonItem, IonLabel, IonInput,
    IonButton, IonIcon, IonInputPasswordToggle,
    CommonModule, FormsModule
  ]
})
export class LoginPage {

  email: string = '';
  password: string = '';

  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  loadingCtrl: LoadingController = inject(LoadingController);
  alertCtrl: AlertController = inject(AlertController);

  constructor() {
    addIcons({ barbell, mailOutline, lockClosedOutline, arrowForward });
  }

  async login() {
    if (!this.email || !this.password) {
      const alert = await this.alertCtrl.create({
        header: 'Greška',
        message: 'Unesite email i lozinku!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Prijava u toku...'
    });
    await loading.present();

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (userData) => {
        this.authService.getUserRole(userData.localId).subscribe({
          next: async (role) => {
            await loading.dismiss();
            if (role === 'admin') {
              this.router.navigate(['/admin']);
            } else if (role === 'zaposleni') {
              this.router.navigate(['/zaposleni']);
            } else {
              this.router.navigate(['/klijent']);
            }
          }
        });
      },
      error: async (error) => {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Greška pri prijavi',
          message: 'Pogrešan email ili lozinka!',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}