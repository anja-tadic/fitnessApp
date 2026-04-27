import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trener-detalji',
  templateUrl: './trener-detalji.page.html',
  styleUrls: ['./trener-detalji.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonBackButton, IonButtons, CommonModule]
})
export class TrenerDetaljiPage implements OnInit {

  trener: any = null;

  constructor(private firestore: Firestore, private route: ActivatedRoute) {}

  async ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('uid');
    if (uid) {
      const docRef = doc(this.firestore, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.trener = docSnap.data();
      }
    }
  }
}