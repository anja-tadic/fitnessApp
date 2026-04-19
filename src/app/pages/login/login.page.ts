import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, CommonModule, FormsModule]
})
export class LoginPage {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      const userCredential = await this.authService.login(this.email, this.password);
      const role = await this.authService.getUserRole(userCredential.user.uid);

      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (role === 'zaposleni') {
        this.router.navigate(['/zaposleni']);
      } else {
        this.router.navigate(['/klijent']);
      }
    } catch (error) {
      console.error('Greška pri prijavi:', error);
      alert('Pogrešan email ili lozinka!');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
