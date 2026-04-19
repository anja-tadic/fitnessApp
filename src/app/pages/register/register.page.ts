import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, CommonModule, FormsModule]
})
export class RegisterPage {

  name: string = '';
  email: string = '';
  password: string = '';
  gender: string = '';
  phone: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    try {
    await this.authService.register(this.email, this.password, 'klijent', this.name, this.gender, this.phone);
    console.log('Registracija uspješna, preusmjeravam...');
    alert('Uspješna registracija!');
    await this.router.navigate(['/klijent']);
    console.log('Preusmjeravanje završeno');
  } catch (error) {
    console.error('Greška pri registraciji:', error);
    alert('Greška pri registraciji!');
  }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
