import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-moji-treninzi',
  templateUrl: './moji-treninzi.page.html',
  styleUrls: ['./moji-treninzi.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonButtons, IonIcon, CommonModule]
})
export class MojiTreninziPage implements OnInit {

  treninzi: any[] = [];

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router
  ) {
    addIcons({ logOutOutline });
  }

  ngOnInit() {
  this.auth.onAuthStateChanged(user => {
    if (user) {
      const ref = collection(this.firestore, 'treninzi');
      const q = query(ref, where('trenerUid', '==', user.uid));
      collectionData(q, { idField: 'id' }).subscribe(data => {
        this.treninzi = data.sort((a: any, b: any) =>
          new Date(a.datum).getTime() - new Date(b.datum).getTime()
        );
      });
    }
  });
}

  async odjavi() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }
  otvoriDetalje(id: string) {
  this.router.navigate(['/zaposleni/trening-detalji', id]);
}
}