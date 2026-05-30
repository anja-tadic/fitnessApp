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

@Component({ // Html komponenta
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true, //samostalna, svaka komp uvozi sta njoj treba
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
  loadingCtrl: LoadingController = inject(LoadingController); //spinner
  alertCtrl: AlertController = inject(AlertController); //popup

  constructor() {
    addIcons({ barbell, mailOutline, lockClosedOutline, arrowForward });
  }

  async login() {
    if (!this.email || !this.password) {
      const alert = await this.alertCtrl.create({ // peavi alert obj
        header: 'Greška',
        message: 'Unesite email i lozinku!',
        buttons: ['OK']
      });
      await alert.present(); // prikazuje ga 
      return;
    }

    const loading = await this.loadingCtrl.create({  // spiner
      message: 'Prijava u toku...'
    });
    await loading.present();

    try {
      const userCredential = await this.authService.login(this.email, this.password);
      const role = await this.authService.getUserRole(userCredential.user.uid);
      await loading.dismiss(); // uklanja spinner sa ekrana

      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (role === 'zaposleni') {
        this.router.navigate(['/zaposleni']);
      } else {
        this.router.navigate(['/klijent']);
      }

    } catch (error) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({  //obrada greske
        header: 'Greška pri prijavi',
        message: 'Pogrešan email ili lozinka!',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}