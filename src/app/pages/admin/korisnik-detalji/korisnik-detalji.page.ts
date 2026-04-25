import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonButton, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-korisnik-detalji',
  templateUrl: './korisnik-detalji.page.html',
  styleUrls: ['./korisnik-detalji.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonButton, IonBackButton, IonButtons, CommonModule]
})
export class KorisnikDetaljiPage implements OnInit {

  korisnik: any = null; // podaci o korisniku

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute, // citamo uid iz URL-a
    private router: Router
  ) {}

  async ngOnInit() {
    // Uzimamo uid iz URL-a npr. /admin/korisnik-detalji/abc123
    const uid = this.route.snapshot.paramMap.get('uid');

    if (uid) {
      // Trazimo dokument iz baze sa tim uid-om
      const docRef = doc(this.firestore, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.korisnik = docSnap.data(); // čuvamo podatke u promenljivoj
      }
    }
  }

  nazad() {
    this.router.navigate(['/admin/korisnici']);
  }
}