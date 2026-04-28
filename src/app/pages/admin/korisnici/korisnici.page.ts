import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonButton, IonBadge, IonButtons } from '@ionic/angular/standalone';
import { Firestore, collection, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-korisnici',
  templateUrl: './korisnici.page.html',
  styleUrls: ['./korisnici.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonButton, IonBadge, IonButtons, CommonModule]
})
export class KorisniciPage implements OnInit {

  korisnici$!: Observable<any[]>;

  constructor(private firestore: Firestore, private auth: Auth, private router: Router) {}

  ngOnInit() {
    const korisniciRef = collection(this.firestore, 'users');
    this.korisnici$ = collectionData(korisniciRef, { idField: 'id' });
  }

  otvoriProfil(uid: string) {
    this.router.navigate(['/admin/korisnik-detalji', uid]);
  }

  async obrisiKorisnika(uid: string) {
    if (confirm('Da li ste sigurni?')) {
      await deleteDoc(doc(this.firestore, 'users', uid));
    }
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }
}