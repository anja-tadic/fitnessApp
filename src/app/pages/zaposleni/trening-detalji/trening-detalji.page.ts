import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonBackButton, IonButtons, IonItemDivider } from '@ionic/angular/standalone';
import { Firestore, doc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trening-detalji',
  templateUrl: './trening-detalji.page.html',
  styleUrls: ['./trening-detalji.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonBackButton, IonButtons, IonItemDivider, CommonModule]
})
export class TreningDetaljiPage implements OnInit {

  trening: any = null;
  klijenti: any[] = [];

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // Ucitavamo podatke o treningu
      const docRef = doc(this.firestore, 'treninzi', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.trening = { id: docSnap.id, ...docSnap.data() };

        // Ucitavamo prijavljene klijente
        await this.ucitajKlijente(id);
      }
    }
  }

  async ucitajKlijente(treningId: string) {
    // Trazimo sve prijave za ovaj trening
    const ref = collection(this.firestore, 'prijave');
    const q = query(ref, where('treningId', '==', treningId));
    const snapshot = await getDocs(q);

    // Za svaku prijavu uzimamo podatke o klijentu
    const klijentiPromises = snapshot.docs.map(async d => {
      const prijava = d.data();
      const userRef = doc(this.firestore, 'users', prijava['klijentUid']);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? userSnap.data() : null;
    });

    this.klijenti = (await Promise.all(klijentiPromises)).filter(k => k !== null);
  }
}