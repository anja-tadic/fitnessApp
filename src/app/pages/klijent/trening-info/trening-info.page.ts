import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-trening-info',
  templateUrl: './trening-info.page.html',
  styleUrls: ['./trening-info.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonBackButton, IonButtons, CommonModule]
})
export class TreningInfoPage {

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute); // citamo id iz URL-a

  trening: any = null; // podaci o treningu

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id'); // uzimamo id iz URL-a

    if (id) {
      this.authService.getTreningById(id).subscribe(trening => {
        this.trening = trening;
      });
    }
  }
}