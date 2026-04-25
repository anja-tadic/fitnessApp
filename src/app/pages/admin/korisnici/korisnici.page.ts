import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonButton, IonBadge } from '@ionic/angular/standalone';
import { Firestore, collection, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'; // tip podataka koji se menja u realnom vremenu 

@Component({
  selector: 'app-korisnici',
  templateUrl: './korisnici.page.html',
  styleUrls: ['./korisnici.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonButton, IonBadge, CommonModule]
})
export class KorisniciPage implements OnInit { // implementiramo onInit jer cemo koristiti tu metodu 

  korisnici$!: Observable<any[]>; // deklarisemo promenljivu $-observable, !-nije undefined

  constructor(private firestore: Firestore, private router: Router) {} // angular automatski ubacuje firestore i router servise

  ngOnInit() { // metoda se izvrsava cim se ucita stranica
    // Učitavamo sve korisnike iz baze — lista se automatski osvežava
    const korisniciRef = collection(this.firestore, 'users'); // uzima referencu ka kolekciji users iz baze
    this.korisnici$ = collectionData(korisniciRef, { idField: 'id' });
  }

  // Navigacija na profil korisnika
  otvoriProfil(uid: string) {
    this.router.navigate(['/admin/korisnik-detalji', uid]); // navigira na stranicu detalja i salje uid korisnika
  }

  async obrisiKorisnika(uid: string) {
    if (confirm('Da li ste sigurni?')) {
      await deleteDoc(doc(this.firestore, 'users', uid)); // brisanje iz baze
    }
  }
}