import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
  IonLabel, IonButton, IonButtons, IonIcon, IonInput, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { Firestore, collection, collectionData, doc, deleteDoc, query, where } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-treneri',
  templateUrl: './treneri.page.html',
  styleUrls: ['./treneri.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
    IonLabel, IonButton, IonButtons, IonIcon, IonInput, IonSelect,
    IonSelectOption, CommonModule, FormsModule
  ]
})
export class TreneriPage implements OnInit {

  treneri: any[] = [];
  prikaziFormu: boolean = false;

  noviTrener = {
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: ''
  };

  constructor(private firestore: Firestore, private authService: AuthService, private router: Router) {
    addIcons({ addOutline, trashOutline });
  }

  ngOnInit() {
    // Učitavamo samo korisnike sa ulogom 'zaposleni'
    const ref = collection(this.firestore, 'users');
    const q = query(ref, where('role', '==', 'zaposleni'));
    collectionData(q, { idField: 'uid' }).subscribe(data => {
      this.treneri = data;
    });
  }

  otvoriFormu() {
    this.prikaziFormu = true;
  }

  zatvoriFormu() {
    this.prikaziFormu = false;
    // Resetujemo formu
    this.noviTrener = { name: '', email: '', password: '', phone: '', gender: '' };
  }

  async dodajTrenera() {
    // Provera da li su sva polja popunjena
   if (!this.noviTrener.name || !this.noviTrener.email || !this.noviTrener.password) {
      alert('Ime, email i lozinka su obavezni!');
      return;
    }

    if (!this.noviTrener.email.endsWith('@trener.com')) {
      alert('Email trenera mora biti u formatu: ime@trener.com');
      return;
    }

    try {
      // Koristimo isti register metod iz AuthService, samo sa ulogom 'zaposleni'
      await this.authService.register(
        this.noviTrener.email,
        this.noviTrener.password,
        'zaposleni',
        this.noviTrener.name,
        this.noviTrener.gender,
        this.noviTrener.phone
      );
      alert('Trener uspešno dodat!');
      this.zatvoriFormu();
  
     } catch (error: any) {
      console.error('Greška:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert('Korisnik sa ovim emailom već postoji!');
      } else if (error.code === 'auth/weak-password') {
        alert('Lozinka mora imati najmanje 6 karaktera!');
      } else {
        alert('Greška pri dodavanju trenera!');
      }
    }
    }
  

  async obrisiTrenera(uid: string) {
    if (confirm('Da li ste sigurni da želite da obrišete ovog trenera?')) {
      await deleteDoc(doc(this.firestore, 'users', uid));
    }
  }
  otvoriProfil(uid: string) {
    this.router.navigate(['/admin/trener-detalji', uid]);
  }
}