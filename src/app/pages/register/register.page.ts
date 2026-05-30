import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonItem, IonLabel, IonInput,
  IonButton, IonSelect, IonSelectOption, IonIcon, IonInputPasswordToggle,
  LoadingController, AlertController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, callOutline, arrowForward } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonItem, IonLabel, IonInput,
    IonButton, IonSelect, IonSelectOption, IonIcon, IonInputPasswordToggle,
    CommonModule, ReactiveFormsModule
  ]
})
export class RegisterPage {

  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  loadingCtrl: LoadingController = inject(LoadingController);
  alertCtrl: AlertController = inject(AlertController);

  registerForm = new FormGroup({ //cela forma, provera validnosti, i cuve i provera
    name: new FormControl('', Validators.required),// jedno polje, ima tr vrenost i validaciju
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    gender: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  constructor() {
    addIcons({ personOutline, mailOutline, lockClosedOutline, callOutline, arrowForward });
  }

  async register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      const alert = await this.alertCtrl.create({ //popup
        header: 'Greška',
        message: 'Sva polja su obavezna!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingCtrl.create({ // spinner
      message: 'Registracija u toku...'
    });
    await loading.present();

    try {
      const { name, email, password, gender, phone } = this.registerForm.value;
      await this.authService.register(email!, password!, 'klijent', name!, gender!, phone!);
      await loading.dismiss(); // uklanjamo spinner

      const alert = await this.alertCtrl.create({
        header: 'Uspeh',
        message: 'Registracija uspešna!',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigate(['/klijent']);

    } catch (error) {
      await loading.dismiss(); 
      const alert = await this.alertCtrl.create({ // obrada gresaka
        header: 'Greška',
        message: 'Greška pri registraciji. Pokušajte ponovo!',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}