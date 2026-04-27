import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trening-info',
  templateUrl: './trening-info.page.html',
  styleUrls: ['./trening-info.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonBackButton, IonButtons, CommonModule]
})
export class TreningInfoPage implements OnInit {

  trening: any = null; // podaci o treningu

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute // citamo id iz URL-a
  ) {}

  async ngOnInit() {
    // Uzimamo id treninga iz URL-a
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // Ucitavamo trening iz baze po id-u
      const docRef = doc(this.firestore, 'treninzi', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.trening = docSnap.data();
      }
    }
  }
}