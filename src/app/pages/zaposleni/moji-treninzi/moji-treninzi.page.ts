import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonButtons } from '@ionic/angular/standalone';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-moji-treninzi',
  templateUrl: './moji-treninzi.page.html',
  styleUrls: ['./moji-treninzi.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonButtons, CommonModule]
})
export class MojiTreninziPage implements OnInit {

  private authService = inject(AuthService);
  private auth = inject(Auth); // potreban za currentUser
  private router = inject(Router);

  treninzi: any[] = [];

  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        // uzimamo treninge za ovog trenera
        this.authService.getTreninziZaTrenera(user.uid).subscribe(data => {
          this.treninzi = data.sort((a: any, b: any) =>
            new Date(a.datum).getTime() - new Date(b.datum).getTime()
          );
        });
      }
    });
  }

  otvoriDetalje(id: string) {
    this.router.navigate(['/zaposleni/trening-detalji', id]);
  }
}